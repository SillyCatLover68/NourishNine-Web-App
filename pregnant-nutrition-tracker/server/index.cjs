// Load local .env into process.env (keeps secrets out of repo). If you prefer not to
// use .env, you can set environment variables in your shell or hosting provider.
const path = require('path');
try { 
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); 
  console.log('Environment variables loaded from .env');
} catch (e) { 
  console.warn('Could not load .env file:', e.message);
}

var admin = require("firebase-admin");
// Try to load a service account JSON placed at server/serviceAccountKey.json
// IMPORTANT: Do NOT commit your real serviceAccountKey.json to source control.
let serviceAccount = null;
try {
  serviceAccount = require("./serviceAccountKey.json");
} catch (e) {
  console.warn('server: serviceAccountKey.json not found — Firebase Admin will not be initialized.');
}

if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin initialized.");
  } catch (e) {
    console.warn('server: failed to initialize Firebase Admin:', e && e.message ? e.message : e);
  }
} else {
  console.warn('server: Firebase Admin skipped — some server features may be disabled.');
}

// Export admin for use in other server modules if needed
try {
  const express = require('express');

  const app = express();
  app.use(express.json());

  // Persist arbitrary food log entries (best-effort). If Admin SDK is initialized this will
  // write to `foodLogs` collection. Accepts a JSON body with the logged entry.
  app.post('/api/foodlog', async (req, res) => {
    const payload = req.body;
    if (!payload || !payload.name) return res.status(400).json({ error: 'missing entry name' });

    // Try to verify optional ID token to associate with a user
    let uid = null;
    try {
      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      const idToken = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.slice(7) : (req.body && req.body.idToken) || req.query.idToken;
      if (idToken && admin && admin.auth) {
        try {
          const decoded = await admin.auth().verifyIdToken(idToken);
          uid = decoded && decoded.uid ? decoded.uid : null;
        } catch (e) {
          console.warn('server: verifyIdToken failed for foodlog', e && e.message ? e.message : e);
        }
      }
    } catch (e) {
      console.warn('server: id token handling error (foodlog)', e && e.message ? e.message : e);
    }

    // Always respond success (best-effort write)
    if (admin && admin.firestore) {
      try {
        const doc = {
          name: payload.name,
          mealType: payload.mealType || null,
          notes: payload.notes || null,
          time: payload.time ? new Date(payload.time) : new Date(),
          nutrientAmounts: payload.nutrientAmounts || null,
          calories: typeof payload.calories === 'number' ? payload.calories : (payload.calories ? Number(payload.calories) : null),
          userId: uid,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        };
        await admin.firestore().collection('foodLogs').add(doc);
      } catch (e) {
        console.warn('server: Firestore write (foodlog) failed', e && e.message ? e.message : e);
      }
    }

    return res.status(200).json({ ok: true });
  });

  // Upsert a user's profile (requires ID token). If Admin SDK is initialized, writes to
  // `profiles` collection keyed by UID. Accepts JSON body with profile fields.
  app.post('/api/profile', async (req, res) => {
    const payload = req.body;
    if (!payload) return res.status(400).json({ error: 'missing profile payload' });

    let uid = null;
    try {
      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      const idToken = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.slice(7) : (req.body && req.body.idToken) || req.query.idToken;
      if (!idToken) return res.status(401).json({ error: 'missing id token' });
      if (!admin || !admin.auth) return res.status(500).json({ error: 'Firebase admin not initialized' });
      const decoded = await admin.auth().verifyIdToken(idToken);
      uid = decoded && decoded.uid ? decoded.uid : null;
      if (!uid) return res.status(401).json({ error: 'invalid token' });
    } catch (e) {
      console.warn('server: verifyIdToken failed for profile', e && e.message ? e.message : e);
      return res.status(401).json({ error: 'token verification failed' });
    }

    try {
      if (admin && admin.firestore) {
        const doc = { ...payload, updatedAt: admin.firestore.FieldValue.serverTimestamp() };
        await admin.firestore().collection('profiles').doc(uid).set(doc, { merge: true });
      }
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('server: failed to write profile', e && e.message ? e.message : e);
      return res.status(500).json({ error: 'failed to write profile' });
    }
  });

  // Delete a user's profile (requires ID token). Removes the profiles/{uid} document.
  app.delete('/api/profile', async (req, res) => {
    let uid = null;
    try {
      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      const idToken = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.slice(7) : (req.body && req.body.idToken) || req.query.idToken;
      if (!idToken) return res.status(401).json({ error: 'missing id token' });
      if (!admin || !admin.auth) return res.status(500).json({ error: 'Firebase admin not initialized' });
      const decoded = await admin.auth().verifyIdToken(idToken);
      uid = decoded && decoded.uid ? decoded.uid : null;
      if (!uid) return res.status(401).json({ error: 'invalid token' });
    } catch (e) {
      console.warn('server: verifyIdToken failed for profile delete', e && e.message ? e.message : e);
      return res.status(401).json({ error: 'token verification failed' });
    }

    try {
      if (admin && admin.firestore) {
        await admin.firestore().collection('profiles').doc(uid).delete();
      }
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('server: failed to delete profile', e && e.message ? e.message : e);
      return res.status(500).json({ error: 'failed to delete profile' });
    }
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server API listening on port ${PORT}`);
  });
} catch (e) {
  // If express/axios aren't installed or other errors, we silently skip starting the API.
}

module.exports = admin;
