"use client"
import Image from 'next/image'
import userIcon from "@/public/images/user-icon.svg"
import "./info.css"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

function Info() {
  const [formData, setFormData] = useState({
    fullname: "",
    image : ""
  });
  const [error, setError] = useState("")
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  const router = useRouter()
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  async function finishSignup(){
    if(!formData.image || !formData.fullname.trim()){
      setError("Please fill in all fields");
      return;
    }

    try{
      setSubmissionStatus("submitting");
      const rawFetch = await fetch(`${BASE_URL}/api/users/signup/info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const resData = await rawFetch.json();

      if(!rawFetch.ok){
        throw new Error(resData.message || "Failed to complete signup");
      }
      console.log("Signup info submitted successfully");
      router.push("/currency");

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }finally{
      setSubmissionStatus("idle");
    }
  }

  return (
    <div className="user-info-screen">

      <form 
      onSubmit={(e) => {
        e.preventDefault();
        finishSignup();
      }}
      >

      <div>
        <p className='auth-label'>UPLOAD A PROFILE PICTURE</p>

        <div 
          className="user-circle"
          onClick={() => {
            setError("")
            document.getElementById('profileImageInput')?.click()
          }}
          style={{
            backgroundImage: formData.image ? `url(${formData.image})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!formData.image && (
            <Image 
              src={userIcon}
              alt='user icon'
            />
          )}
          <input 
            id="profileImageInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
          // Check file size (2MB limit)
          if (file.size > 2 * 1024 * 1024) {
            alert("Image size must be less than 2MB");
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (event) => {
            setFormData({
              ...formData, 
              image: event.target?.result as string
            });
          };
          reader.readAsDataURL(file);
              }
            }}
          />
        </div>

      </div>

      <div>
        <label 
        className="auth-label"
        htmlFor="fullname">
          FULLNAME
        </label>

        <input 
        onChange={(e) => {
          setError("")
          setFormData(
          {...formData, 
            fullname: e.target.value})}}
        name="fullname"
        className='auth-input'
        type="text" 
        id='fullname' />
      </div>

      {error && <p className="error-text">{error}</p>}

      <button 
      disabled={submissionStatus === "submitting" || error !== ""}
      className='primary-button'>
        {submissionStatus === "submitting" ? "Submitting..." : "Finish Signup"}
      </button>
      </form>
    </div>
  )
}

export default Info