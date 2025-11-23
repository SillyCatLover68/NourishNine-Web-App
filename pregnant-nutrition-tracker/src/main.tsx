import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "./lib/firebase";
import { getCurrentIdToken } from "./lib/firebaseAuth";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Global auth listener: keep localStorage.userData in sync and optionally persist profile server-side
if (isFirebaseConfigured && auth) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const profile = { uid: user.uid, email: user.email, displayName: user.displayName || "" };
      localStorage.setItem("userData", JSON.stringify(profile));
      window.dispatchEvent(new Event("userUpdated"));
      try {
        const token = await getCurrentIdToken();
        if (token) {
          await fetch("/api/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            body: JSON.stringify(profile),
          });
        }
      } catch (e) {
        console.warn("Profile sync failed:", e);
      }
    } else {
      localStorage.removeItem("userData");
      window.dispatchEvent(new Event("userUpdated"));
    }
  });
}
