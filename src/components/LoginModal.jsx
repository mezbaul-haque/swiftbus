import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut
} from "firebase/auth";
import { auth } from "../config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export default function LoginModal({ onLogin }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        // Registration mode
        if (!name.trim()) {
          setError("Full name is required for registration");
          setIsLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Update display name on Firebase Auth user
        try {
          await updateProfile(user, { displayName: name });
        } catch (e) {
          // ignore profile update errors
        }
        // Save user profile in Firestore
        try {
          await setDoc(doc(db, "users", user.uid), {
            email: email,
            displayName: name,
            phone: phone || "",
            createdAt: serverTimestamp()
          });
        } catch (e) {
          console.error("Failed to create user profile in Firestore:", e);
        }
        // Send verification email
        try {
          await sendEmailVerification(user);
          setInfoMessage("Verification email sent — please check your inbox before logging in.");
        } catch (e) {
          console.error("Failed to send verification email:", e);
          setError("Account created, but failed to send verification email. Check your Firebase settings.");
        }
        // Sign out the user so they must verify before logging in
        try { await signOut(auth); } catch {}
        setIsRegistering(false);
      } else {
        // Login mode
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        if (!user.emailVerified) {
          // force sign out and instruct user to verify
          try { await signOut(auth); } catch {}
          setError("Email not verified. Please check your inbox. You can resend verification below.");
          setInfoMessage("");
          return;
        }
        onLogin(user);
      }
    } catch (err) {
      let errorMessage = err.message;
      
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email already registered. Please log in.";
      } else if (err.code === "auth/user-not-found") {
        errorMessage = "Email not found. Create an account first.";
      } else if (err.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Use 6+ characters.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  async function resendVerification() {
    setError("");
    setInfoMessage("");
    setIsLoading(true);
    try {
      // attempt sign-in to get user object without requiring verification
      const userCredential = await signInWithEmailAndPassword(auth, email, password).catch(() => null);
      const user = userCredential?.user || auth.currentUser;
      if (!user) {
        setError("Sign in required to resend verification. Enter correct credentials and try Login.");
        return;
      }
      await sendEmailVerification(user);
      setInfoMessage("Verification email resent. Check your inbox.");
      try { await signOut(auth); } catch {}
    } catch (e) {
      console.error(e);
      setError("Unable to resend verification email.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <h1>SwiftBus</h1>
        <h2>{isRegistering ? "Create Account" : "Login"}</h2>
        
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="form-group">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                disabled={isLoading}
              />
            </div>
          )}

          {isRegistering && (
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Optional phone number"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          {error && <div className={`error-message ${isLoading ? "" : ""}`}>{error}</div>}
          {infoMessage && <div className="error-message success">{infoMessage}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? "Loading..." : (isRegistering ? "Register" : "Login")}
          </button>
        </form>

        {error && error.toLowerCase().includes("verify") && (
          <div style={{ marginTop: 12 }}>
            <button className="login-btn" onClick={resendVerification} disabled={isLoading}>
              Resend verification email
            </button>
          </div>
        )}

        <div className="auth-toggle">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setError("");
                  setPassword("");
                }}
                disabled={isLoading}
              >
                Login here
              </button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setError("");
                  setPassword("");
                }}
                disabled={isLoading}
              >
                Register here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
