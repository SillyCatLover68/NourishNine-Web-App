// Load local .env into process.env (keeps secrets out of repo). If you prefer not to
// use .env, you can set environment variables in your shell or hosting provider.
const path = require('path');
try { 
  require('dotenv').config({ path: path.join(__dirname, '..', '.env') }); 
  console.log('Environment variables loaded from .env');
  console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);
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
// Minimal API to look up nutrient estimates using OpenAI (server-side only).
// Configure OPENAI_API_KEY in your environment (e.g. via a local .env file). Do NOT commit keys.
try {
  const express = require('express');
  const axios = require('axios');

  const app = express();
  app.use(express.json());

  app.post('/api/nutrients', async (req, res) => {
    const name = (req.body && req.body.name) || req.query.name;
    if (!name) return res.status(400).json({ error: 'missing food name' });

    // Optionally accept a Firebase ID token to associate the lookup with a user.
    // Token can be provided as `Authorization: Bearer <token>` header, or
    // as `idToken` in the JSON body or query param.
    let uid = null;
    try {
      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      const idToken = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.slice(7) : (req.body && req.body.idToken) || req.query.idToken;
      if (idToken && admin && admin.auth) {
        try {
          const decoded = await admin.auth().verifyIdToken(idToken);
          uid = decoded && decoded.uid ? decoded.uid : null;
        } catch (e) {
          console.warn('server: verifyIdToken failed', e && e.message ? e.message : e);
          // do not fail the request; treat as unauthenticated
        }
      }
    } catch (e) {
      console.warn('server: id token handling error', e && e.message ? e.message : e);
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured on server' });
    }

    try {
      const prompt = `Provide a JSON object only (no commentary) that gives approximate nutrient amounts per one typical serving for the food named:\n\n${name}\n\nReturn the following keys with numeric values (use 0 if unknown): Iron (mg), Protein (g), Calcium (mg), Folate (mcg), DHA (mg), Vitamin C (mg), Fiber (g). Example: {"Iron":2,"Protein":8,...}`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a concise nutrition assistant that returns only JSON.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.2
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      });

      const content = response.data?.choices?.[0]?.message?.content || response.data?.choices?.[0]?.text;
      let parsed = null;
      if (content) {
        try {
          parsed = JSON.parse(content);
        } catch (e) {
          // try to extract JSON substring
          const m = content.match(/\{[\s\S]*\}/);
          if (m) {
            try { parsed = JSON.parse(m[0]); } catch (e2) { parsed = null; }
          }
        }
      }

      if (!parsed) {
        // If Admin SDK is initialized, store the failed/raw lookup for debugging/analytics
        if (admin && admin.firestore) {
          try {
            await admin.firestore().collection('nutrientLookups').add({
              name,
              nutrientAmounts: null,
              raw: content,
              userId: uid,
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
          } catch (e) {
            console.warn('server: Firestore write (raw) failed', e && e.message ? e.message : e);
          }
        }
        return res.status(200).json({ nutrientAmounts: null, raw: content });
      }

      // Persist successful parsed results when Admin SDK is available
      if (admin && admin.firestore) {
        try {
          await admin.firestore().collection('nutrientLookups').add({
            name,
            nutrientAmounts: parsed,
            raw: content,
            userId: uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } catch (e) {
          console.warn('server: Firestore write failed', e && e.message ? e.message : e);
        }
      }

      return res.status(200).json({ nutrientAmounts: parsed });
    } catch (err) {
      console.error('OpenAI lookup error', err && err.toString());
      return res.status(500).json({ error: 'failed to fetch nutrient estimates' });
    }
  });

  app.post('/api/suggest', async (req, res) => {
    const name = (req.body && req.body.name) || req.query.name;
    if (!name) return res.status(400).json({ error: 'missing food name' });

    // Optionally accept ID token to associate suggestions with a user (same behavior as /api/nutrients)
    let uid = null;
    try {
      const authHeader = req.headers['authorization'] || req.headers['Authorization'];
      const idToken = (authHeader && authHeader.startsWith('Bearer ')) ? authHeader.slice(7) : (req.body && req.body.idToken) || req.query.idToken;
      if (idToken && admin && admin.auth) {
        try {
          const decoded = await admin.auth().verifyIdToken(idToken);
          uid = decoded && decoded.uid ? decoded.uid : null;
        } catch (e) {
          console.warn('server: verifyIdToken failed', e && e.message ? e.message : e);
        }
      }
    } catch (e) {
      console.warn('server: id token handling error', e && e.message ? e.message : e);
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured on server' });
    }

    try {
      const prompt = `Provide a JSON array (no commentary) of 5 short meal or swap suggestions related to this food name: ${name}. Respond with an array of strings, e.g. ["Grilled salmon salad","Tuna sandwich", ...]. Keep items short.`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a concise nutrition suggestions assistant that returns only JSON arrays.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.6
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      });

      const content = response.data?.choices?.[0]?.message?.content || response.data?.choices?.[0]?.text;
      let parsed = null;
      if (content) {
        try {
          parsed = JSON.parse(content);
        } catch (e) {
          const m = content.match(/\[[\s\S]*\]/);
          if (m) {
            try { parsed = JSON.parse(m[0]); } catch (e2) { parsed = null; }
          }
        }
      }

      if (!parsed) {
        if (admin && admin.firestore) {
          try {
            await admin.firestore().collection('suggestions').add({
              name,
              suggestions: [],
              raw: content,
              userId: uid,
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
          } catch (e) {
            console.warn('server: Firestore write (raw suggestions) failed', e && e.message ? e.message : e);
          }
        }
        return res.status(200).json({ suggestions: [], raw: content });
      }

      if (admin && admin.firestore) {
        try {
          await admin.firestore().collection('suggestions').add({
            name,
            suggestions: parsed,
            raw: content,
            userId: uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } catch (e) {
          console.warn('server: Firestore write (suggestions) failed', e && e.message ? e.message : e);
        }
      }

      return res.status(200).json({ suggestions: parsed });
    } catch (err) {
      console.error('OpenAI suggest error', err && err.toString());
      return res.status(500).json({ error: 'failed to fetch suggestions' });
    }
  });

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
