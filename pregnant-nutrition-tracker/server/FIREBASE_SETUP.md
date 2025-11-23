# Firebase Setup (Client + Admin)

This project uses Firebase optionally for client-side Auth and (optionally) server-side access via the Admin SDK. This guide walks you through the minimal steps to enable Firebase for this repo.

## 1) Create a Firebase project

- Go to https://console.firebase.google.com/ and create a new project (or use an existing one).

## 2) Client (web) SDK - Vite environment variables

If you want to enable client-side authentication (sign-in, sign-up), add the following keys to your Vite env file (create a `.env` at project root; do NOT commit it):

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=XXXX
VITE_FIREBASE_APP_ID=1:...:web:...
```

The frontend reads these values in `src/lib/firebase.ts` and will initialize `auth` if `VITE_FIREBASE_API_KEY` is present.

Run the frontend dev server:

```bash
npm run dev
```

## 3) Server (Admin SDK) - service account

The server can use the Firebase Admin SDK to read/write Firestore, verify auth tokens, etc. Steps:

1. In the Google Cloud Console, create a service account for your project and download the JSON key.
2. Save it locally as `server/serviceAccountKey.json` (the repo ignores this file).
3. Start the server with `npm run start-server`. The server will attempt to require `server/serviceAccountKey.json` and initialize the Admin SDK.

Important: Do NOT commit the service account JSON to source control. The repo includes `server/serviceAccount.example.json` as a template.

## 4) Firestore rules and collections

- Open the Firestore UI in the Firebase Console and create any collections you want (the example server will write to `nutrientLookups`).
- Adjust security rules depending on whether you allow client-side writes or only server writes.

## 5) Example usage added to server

The server's `POST /api/nutrients` endpoint now saves each OpenAI lookup to the `nutrientLookups` collection when the Admin SDK is available. Each document has:

- `name` (string)
- `nutrientAmounts` (object | null)
- `raw` (string) — raw OpenAI response content
- `createdAt` (server timestamp)

If you need to associate lookups with users, pass an authenticated user ID or verify an ID token before writing.

### Verifying ID tokens (how this project does it)

The server can optionally accept a Firebase ID token and verify it using the Admin SDK. The server will then attach the user's UID to any Firestore documents it writes so you can associate lookups/suggestions with users.

How to provide the ID token from the client:

- Include the token in the `Authorization` header: `Authorization: Bearer <ID_TOKEN>`
- Or include an `idToken` field in the JSON body (less recommended).

On the client, you can obtain the current user's token using the helper `src/lib/firebaseAuth.ts` which exposes `getCurrentIdToken()`.

Security note: always verify the token server-side using `admin.auth().verifyIdToken(idToken)` before trusting a UID.

## 6) Running locally

Set your OpenAI key and (optionally) Firebase env vars in `.env`:

```
OPENAI_API_KEY=sk_...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Run server:

```bash
npm run start-server
```

Run frontend (in another terminal):

```bash
npm run dev
```

## 7) Next steps / Tips

- Prefer using environment variables or secret managers in production (Google Secret Manager, Cloud Run env vars, GitHub Actions secrets).
- To deploy server code that accesses Firestore, consider Google Cloud Run and pass the service account via IAM or use Workload Identity.
- If you want, I can add ID token verification or per-user writes examples.

---
If anything in this guide is unclear, tell me what part you'd like me to expand (e.g., creating a service account, downloading JSON, or setting Firestore rules).
