"use client"
import Image from "next/image"
import "./entries.css"
import zeniAiIcon from "@/public/images/zeni-ai-icon.svg"
import TransactionsTable from "@/components/dashboard/TransactionsTable/TransactionsTable"
import downIcon from "@/public/images/down-icon.svg"
import sendIcon from "@/public/images/send-icon.svg"
import TodaysDate from "@/components/dashboard/TodaysDate/TodaysDate"
import { useEffect } from "react"



function Entries() {

  return (
    <main className="entries-main">

        <button className="zeni-ai-button">
        <Image
          src={zeniAiIcon}
          alt="add icon"
          />
      </button>

       <header className="entries-main-header">
       <TodaysDate />
        <h1>Your Entries</h1>
      </header>


    
      <div className="entries-and-ai-container">
        <div className="entries-container">
            <TransactionsTable tableTitle="Your Transactions" />
        </div>

        <div className="entries-ai-analysis-bg">

       <div className="ai-analysis-entries">

        <header>
            <p>ASK ZENI AI</p>

            <button>
                <Image 
                alt="close"
                src={downIcon}
                />
            </button>
        </header>

        <div className="ai-analysis-content">
            <h2 className="empty-text">
                Ask about your transactions
            </h2>
        </div>

        <form className="ai-analysis-entries-form">
            <input 
            required
            type="text" 
            name="questions" placeholder="Am I overspending on..." />

            <button>
                <Image 
                src={sendIcon}
                alt="send"
                />
            </button>
        </form>
       </div>

        </div>


      </div>

    </main>
  )
}

export default Entries