"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
const BASE_URL = process.env.BACKEND_URL || "http://localhost:3001";

type signUpResponse = {
  success : boolean,
  message : string,
  uid : string,
  email : string
}



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

  async function sendDataToBackend(){
    setSubmissionStatus("submitting")
    try{
      const rawData = await fetch(`${BASE_URL}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      }); 

      const resData: signUpResponse = await rawData.json();

      if(!rawData.ok){
        throw new Error(resData.message || "Signup failed");
      }

      router.push("/signup/info");
    }
    catch(err: unknown){
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
        sendDataToBackend();
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
