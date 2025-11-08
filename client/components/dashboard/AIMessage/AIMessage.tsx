import Image from "next/image";
import "./AIMessage.css"
import zeniAIIcon from "@/public/images/zeni-ai-icon.svg"
import { useEffect, useState } from "react";
import Link from "next/link";
import { convertImageToBase64 } from "@/libs/base";

type UploadedImage = {
    file: File;
    previewUrl: string;
    name: string;
    size: number;
}

type aiMessageProps = {
    messageToPerformAction : string;
    imageData : UploadedImage | null;
    setShowModal: (show: boolean) => void;
}

type sendingStatusType = "sending" | "completed" | "error";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

function AIMessage({messageToPerformAction, imageData, setShowModal} : aiMessageProps) {
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
            let url;
            let payload;
            if(imageData){
                const base64Url = await convertImageToBase64(imageData.file);
                url = `${BASE_URL}/api/transactions/ai/image/`;
                payload = {
                    sessionId,
                    userText: messageToPerformAction,
                    imageData : {...imageData, base : base64Url}
                }
            }else{
                url = `${BASE_URL}/api/transactions/ai/`;
                payload = { sessionId, userText: messageToPerformAction }
            }
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials : "include",
                body: JSON.stringify(payload)
            });

            const responseInJson = await response.json();

            if (!response.ok) {
                setErrorMessage(responseInJson.message || "Unknown error occurred");
                setSendingStatus("error");
                throw new Error("AI agent error",{cause : responseInJson});
            }

            console.log("AI session response:", responseInJson);
            const lastIndex = responseInJson.agentResponse.length - 1;
            const textToDisplay = responseInJson.agentResponse[lastIndex].content.parts[0].text
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
            <p className="ai-message-text success-text">Your expense has been logged successfully. You can view all your expenses here : <Link onClick={()=>{setShowModal(false)}}  href={"/dashboard/entries"}>All Expenses</Link></p>
        )
    }
    </div>
  )
}

export default AIMessage