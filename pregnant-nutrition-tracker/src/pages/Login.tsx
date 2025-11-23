import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import { getCurrentIdToken } from "../lib/firebaseAuth";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveLocalProfile = (user: any) => {
    const profile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "",
    };
    localStorage.setItem("userData", JSON.stringify(profile));
    window.dispatchEvent(new Event("userUpdated"));
  };

  const persistProfileServer = async (profile: any) => {
    try {
      const token = await getCurrentIdToken();
      if (!token) return;
      await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(profile),
      });
    } catch (e) {
      console.warn("Failed to persist profile:", e);
    }
  };

  const onEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured) throw new Error("Firebase not configured.");
      const result = await signInWithEmailAndPassword(auth!, email, password);
      const user = result.user;
      saveLocalProfile(user);
      await persistProfileServer({ uid: user.uid, email: user.email, displayName: user.displayName });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isFirebaseConfigured) throw new Error("Firebase not configured.");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth!, provider);
      const user = result.user;
      saveLocalProfile(user);
      await persistProfileServer({ uid: user.uid, email: user.email, displayName: user.displayName });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const onForgotPassword = async () => {
    if (!email) {
      setError("Enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth!, email);
      setError("Password reset email sent (check inbox).");
    } catch (err: any) {
      setError(err?.message || "Failed to send reset email.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      <form onSubmit={onEmailSignIn} className="space-y-3">
        <div>
          <label className="block text-sm">Email</label>
          <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded"/>
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded"/>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex items-center gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <button type="button" onClick={onGoogleSignIn} disabled={loading} className="px-4 py-2 border rounded">
            Sign in with Google
          </button>
          <button type="button" onClick={onForgotPassword} className="text-sm underline">
            Forgot?
          </button>
        </div>
      </form>
    </div>
  );
}
