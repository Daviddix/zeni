import Image from "next/image"
import "./AddGoalModal.css"
import addIcon from "@/public/images/add-new-goal-icon.svg"
import closeModalIcon from "@/public/images/close-icon.svg"
import { Dispatch, SetStateAction, useState } from "react"
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

type sendingStatusType = "sending" | "completed" | "error" | "idle";

type addGoalModalProps = {
  setShowAddGoalModal: Dispatch<SetStateAction<boolean>>,
  onSuccess?: () => void,
  onShowSuccessMessage?: (message: string) => void
}

function AddGoalModal({ setShowAddGoalModal, onSuccess, onShowSuccessMessage }: addGoalModalProps) {
  const [goalTyped, setGoalTyped] = useState("")
  const [sendingStatus, setSendingStatus] = useState<sendingStatusType>("idle");
      const [errorMessage, setErrorMessage] = useState<string | null>(null);
      const [responseMessage, setResponseMessage] = useState<string>("");

   async function createAISession(){
         try{
            const response = await fetch(`${BASE_URL}/api/goals/ai/session`, {
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
            const response = await fetch(`${BASE_URL}/api/goals/ai/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials : "include",
                body: JSON.stringify({ sessionId, userText: goalTyped })
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
            
            // Show success message and close modal
            if(onShowSuccessMessage){
                onShowSuccessMessage(textToDisplay);
            }
            if(onSuccess){
                onSuccess();
            }
            
            // Close modal after a brief delay
            setTimeout(() => {
                setShowAddGoalModal(false);
            }, 500);
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
    <div className="modal-bg">
        <div className="add-goal-modal">
            <header>
                <Image 
                src={addIcon}
                alt="add icon"
                />

                <div className="add-goal-modal-header-text">
                    <h3>Add a new Goal</h3>
                    <p>Create a new budget goal using natural language</p>
                </div>

                    <button onClick={() => setShowAddGoalModal(false)}>
                 <Image 
                 
                src={closeModalIcon}
                alt="close icon"
                />                        
                    </button>
            </header>

           <form className="add-goal-form">
            <textarea placeholder="I want to spend less than..." 
            value={goalTyped} 
            onChange={(e) => setGoalTyped(e.target.value)}
            disabled={sendingStatus === "sending"}></textarea>

            {sendingStatus === "error" && errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}

            <button 
            onClick={(e)=>{
                e.preventDefault();
                sendMessageToBackend();
            }}
            disabled={goalTyped.trim().length === 0 || sendingStatus === "sending"}
            className="primary-button">
                {sendingStatus === "sending" ? "Adding Goal..." : "Add Goal"}
            </button>
           </form>
        </div>
    </div>
  )
}

export default AddGoalModal