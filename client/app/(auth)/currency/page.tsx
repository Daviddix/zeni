"use client"

import { useState } from "react"
import "./currency.css"
import SingleCurrency from "@/components/currency/SingleCurrency/SingleCurrency"
import { useRouter } from "next/navigation"

function Currency() {
  const currencies = [{
    name: "US DOLLAR",
    symbol: "$"
  }, {
    name: "NAIRA",
    symbol: "₦"
  }, {
    name: "JAPANESE YEN",
    symbol: "¥"
  }, {
    name: "EURO",
    symbol: "€" 
  }]
  const BASE_URL = process.env.BACKEND_URL || "http://localhost:3001";

  type currencyType = {
    name: string,
    symbol: string
  }

  const router = useRouter()
  const [selectedCurrency, setSelectedCurrency] = useState<currencyType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "submitting" | "submitted">("idle");

  const mappedCurrencies = currencies.map((currency) => (
    <SingleCurrency 
    selectedCurrency={selectedCurrency}
    setSelectedCurrency={setSelectedCurrency}
    key={currency.name} 
    symbol={currency.symbol} 
    name={currency.name} />
  ))

  async function updateUserCurrency(){
    setSubmissionStatus("submitting")
    try{
      const rawFetch = await fetch(`${BASE_URL}/api/users/signup/currency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({currency : selectedCurrency}),
      });

      const resData = await rawFetch.json();

      if (!rawFetch.ok) {
        throw new Error(resData.message || "Failed to update currency");
      }

      router.push("/dashboard/");

    } catch(err){
      console.error("Error updating currency:", err);
      setError(
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
    <div className="currencies-page">

      <div className="currency-container">
        {mappedCurrencies}
      </div>

      {error && <p className="error-text">{error}</p>}

      <button className="primary-button" onClick={updateUserCurrency} disabled={!selectedCurrency || submissionStatus === "submitting"}>
       {submissionStatus === "submitting" ? "Submitting..." : "Get Started"}
      </button>
    </div>
  )
}

export default Currency