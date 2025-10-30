import Image from "next/image";
import "./AIMessage.css"
import zeniAIIcon from "@/public/images/zeni-ai-icon.svg"
import { useEffect, useState } from "react";

type aiMessageProps = {
    messageToPerformAction : string;
}

type sendingStatusType = "sending" | "completed" | "error";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

function AIMessage({messageToPerformAction} : aiMessageProps) {
    const [sendingStatus, setSendingStatus] = useState<sendingStatusType>("sending");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [responseMessage, setResponseMessage] = useState<string>("");

    useEffect(()=>{
        sendMessageToBackend();
    }, [messageToPerformAction])

    async function createAISession(){
         try{
            const response = await fetch(`${BASE_URL}/api/transactions/ai/session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials : "include",
                body: JSON.stringify({})
            });

            const responseInJson = await response.json();

            if (!response.ok) {
                setErrorMessage(responseInJson.message || "Unknown error occurred");
                setSendingStatus("error");
                throw new Error("AI agent error",{cause : responseInJson});
            }

            console.log("AI session response:", responseInJson);
            return responseInJson.sessionId;
        }
        catch(err){
            setSendingStatus("error");
            if(err instanceof Error){
                setErrorMessage(err.message);
            }else{
                setErrorMessage("Failed to communicate with AI agent.");
            }
            console.log("Error sending message to backend:", err);
        }
    }

    async function sendMessageToBackend(){
        setSendingStatus("sending");
        try{
            const sessionId = await createAISession();
            const response = await fetch(`${BASE_URL}/api/transactions/ai/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials : "include",
                body: JSON.stringify({ sessionId, userText: messageToPerformAction })
            });

            const responseInJson = await response.json();

            if (!response.ok) {
                setErrorMessage(responseInJson.message || "Unknown error occurred");
                setSendingStatus("error");
                throw new Error("AI agent error",{cause : responseInJson});
            }

            console.log("AI session response:", responseInJson);
            const textToDisplay = responseInJson.agentResponse[1].content.parts[0].functionResponse.response.message
            setSendingStatus("completed");
            setResponseMessage(textToDisplay)
        }
        catch(err){
            setSendingStatus("error");
            if(err instanceof Error){
                setErrorMessage(err.message);
            }else{
                setErrorMessage("Failed to communicate with AI agent.");
            }
            console.log("Error sending message to backend:", err);
        }
    }
  return (
    <div className="ai-message">
    <Image 
    width={30}
    height={30}
    src={zeniAIIcon}
    alt="your profile picture"
    />

    {
        sendingStatus === "sending" && (
            <p className="ai-message-text">Processing your request...</p>
        )
    } 

        {
            sendingStatus === "error" && (
                <p className="error-text">{errorMessage}</p>
            )
        }

    {
        sendingStatus === "completed" && (
            <p className="ai-message-text success-text">{responseMessage}</p>
        )
    }
    </div>
  )
}

export default AIMessage