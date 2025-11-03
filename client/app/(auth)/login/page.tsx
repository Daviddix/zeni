"use client"

import Link from "next/link"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/firebase/firebaseClient"
import "./login.css"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // Send token to backend to create session cookie
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });

      const responseInJson = await response.json();

      if(!response.ok){
        console.log(responseInJson)
        throw new Error("Couldn't log you in")
      }

      console.log("Logged in successfully")
      router.push("/dashboard");

    } catch (err: unknown) {
      console.error("Login error:", err);
       if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <div>
          <label className="auth-label" htmlFor="email">
            EMAIL ADDRESS
          </label>

          <input
            required
            id="email"
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="auth-label" htmlFor="password">
            PASSWORD
          </label>

          <input
            required
            className="auth-input"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-tip">
          Don&apos;t have an account? <Link href="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;