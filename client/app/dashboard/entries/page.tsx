"use client"
import Image from "next/image"
import "./entries.css"
import zeniAiIcon from "@/public/images/zeni-ai-icon.svg"
import TransactionsTable from "@/components/dashboard/TransactionsTable/TransactionsTable"
import downIcon from "@/public/images/down-icon.svg"
import sendIcon from "@/public/images/send-icon.svg"
import TodaysDate from "@/components/dashboard/TodaysDate/TodaysDate"
import { useState } from "react"
import { useAtomValue } from "jotai"
import { userInfoAtom } from "@/states/dashboard.states"
import UserMessage from "@/components/dashboard/UserMessage/UserMessage"
import EmptyText from "@/components/dashboard/EmptyText/EmptyText"
import AIAnalysisMessage from "@/components/dashboard/AIAnalysisMessage/AIAnalysisMessage"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

type userMessage = {
  messageTyped: string;
  profilePicture: string;
  from: "USER"
}

type aiMessage = {
  messageToDisplay: string;
  from: "AI";
  status: "sending" | "completed" | "error";
}

function Entries() {
  const [messages, setMessages] = useState<(userMessage | aiMessage)[]>([])
  const [userMessage, setUserMessage] = useState("")
  const userInfo = useAtomValue(userInfoAtom)
  const [sendingStatus, setSendingStatus] = useState<"idle" | "sending">("idle")

  async function createAISession() {
    try {
      const response = await fetch(`${BASE_URL}/api/transactions/ai/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({})
      });

      const responseInJson = await response.json();

      if (!response.ok) {
        throw new Error("AI agent error", { cause: responseInJson });
      }

      console.log("AI session response:", responseInJson);
      return responseInJson.sessionId;
    }
    catch (err) {
      console.log("Error creating AI session:", err);
      throw err;
    }
  }

  async function sendMessageToBackend(messageText: string, messageIndex: number) {
    try {
      const sessionId = await createAISession();
      const response = await fetch(`${BASE_URL}/api/transactions/ai/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ sessionId, userText: messageText })
      });

      const responseInJson = await response.json();

      if (!response.ok) {
        setMessages(prev => prev.map((msg, idx) => 
          idx === messageIndex && msg.from === "AI" 
            ? { ...msg, status: "error" as const, messageToDisplay: responseInJson.message || "Failed to get response" }
            : msg
        ));
        throw new Error("AI agent error", { cause: responseInJson });
      }

      console.log("AI analysis response:", responseInJson);
      const textToDisplay = responseInJson.agentResponse?.[5]?.content?.parts?.[0]?.text || 
                           responseInJson.agentResponse?.[1]?.content?.parts?.[0]?.text ||
                           "Analysis completed";
      
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex && msg.from === "AI" 
          ? { ...msg, status: "completed" as const, messageToDisplay: textToDisplay }
          : msg
      ));
    }
    catch (err) {
      console.log("Error sending message to backend:", err);
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex && msg.from === "AI" && msg.status === "sending"
          ? { ...msg, status: "error" as const, messageToDisplay: "Failed to communicate with AI agent." }
          : msg
      ));
    }
  }

  async function submitUserMessage(e: React.FormEvent) {
    e.preventDefault();
    
    if (userMessage.trim().length === 0) return;

    setSendingStatus("sending");

    const userMessageObject: userMessage = {
      messageTyped: userMessage,
      profilePicture: userInfo?.user.image as string,
      from: "USER"
    }

    const aiMessageObject: aiMessage = {
      messageToDisplay: "",
      from: "AI",
      status: "sending"
    }

    const currentMessageIndex = messages.length + 1;
    setMessages(prev => [...prev, userMessageObject, aiMessageObject])
    
    const messageToSend = userMessage;
    setUserMessage("")
    
    await sendMessageToBackend(messageToSend, currentMessageIndex);
    setSendingStatus("idle");
  }

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
            {messages.length === 0 ? (
              <EmptyText textToDisplay="Ask about your transactions" />
            ) : (
              <div className="messages-container">
                {messages.map((message, index) => {
                  if (message.from === "USER") {
                    return (
                      <UserMessage 
                        key={index}
                        messageTyped={message.messageTyped} 
                        profilePicture={message.profilePicture} 
                      />
                    );
                  } else if (message.from === "AI") {
                    return (
                      <AIAnalysisMessage
                        key={index}
                        messageToDisplay={message.messageToDisplay}
                        status={message.status}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            )}
        </div>

        <form onSubmit={submitUserMessage} className="ai-analysis-entries-form">
            <input 
            required
            type="text" 
            name="questions" 
            placeholder="Am I overspending on..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            disabled={sendingStatus === "sending"}
            />

            <button type="submit" disabled={userMessage.trim().length === 0 || sendingStatus === "sending"}>
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