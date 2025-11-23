import { auth } from './firebase';

// Helper to get the current user's ID token (returns null if no user or not configured)
export async function getCurrentIdToken(): Promise<string | null> {
  try {
    if (!auth) return null;
    const user = auth.currentUser;
    if (!user) return null;
    // User object exposes getIdToken()
    const token = await user.getIdToken();
    return token || null;
  } catch (e) {
    console.warn('getCurrentIdToken error', e && ((e as any).message || e));
    return null;
  }
}

export default getCurrentIdToken;
