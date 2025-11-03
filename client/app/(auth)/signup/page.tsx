"use client";

import { auth } from "@/firebase/firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

function Signup() {
  const [formData, setFormData] = useState({
    email : "",
    password : ""
  })

  const [errors, setErrors] = useState("")
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setErrors("")
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSignup() {
    setSubmissionStatus("submitting");
    setErrors("");

    try {
      // Sign up the user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const idToken = await userCredential.user.getIdToken();

      // Send ID token to backend to create secure session cookie
      const res = await fetch(`${BASE_URL}/api/session-logic/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        throw new Error("Failed to create session cookie");
      }

      // Continue to next step of signup
      router.push("/signup/info");
    } catch(err: unknown){
      console.error("Error during signup:", err);
      setErrors(
        err && typeof err === 'object' && 'message' in err 
          ? String(err.message) 
          : "Unknown error"
      );
    }
    finally{
      setSubmissionStatus("idle")
    }
  }
  
  return (
    <div className="signup-page">
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSignup();
      }}>
        <div>
          <label className="auth-label" htmlFor="email">
            EMAIL ADDRESS
          </label>

          <input
          onChange={handleChange}
          name="email" type="email" id="email" required className="auth-input" />
        </div>

        <div>
          <label className="auth-label" htmlFor="password">
            PASSWORD
          </label>

          <input
          onChange={handleChange}
            className="auth-input"
            type="password"
            name="password"
            id="password"
          />
        </div>

        {
          errors && <p className="error-text">{errors}</p>
        }

        <button
          disabled={submissionStatus === "submitting" || errors !== ""}
          className="primary-button"
        >
          {submissionStatus === "submitting" ? "Creating Account..." : "Create Account"}
        </button>

        <p className="auth-tip">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
