import Image from "next/image";
import "./AIMessage.css"
import zeniAIIcon from "@/public/images/zeni-ai-icon.svg"

type aiMessageProps = {
    messageToPerformAction : string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

async function AIMessage({messageToPerformAction} : aiMessageProps) {
    async function sendMessageToBackend(){
        try{
            const response = await fetch(`${BASE_URL}/api/ai/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userText: messageToPerformAction })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log("AI response:", data);
        }
        catch(err){

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

    <p>{messageToPerformAction}</p>
    </div>
  )
}

export default AIMessage