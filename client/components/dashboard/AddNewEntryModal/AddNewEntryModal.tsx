import "./AddNewEntryModal.css"
import Image from 'next/image'
import addIcon from "@/public/images/add-new-goal-icon.svg"
import closeModalIcon from "@/public/images/close-icon.svg"
import imageIcon from "@/public/images/image-icon.svg"
import sendIcon from "@/public/images/send-icon.svg"
import EntryImageUpload from "../EntryImageUpload/EntryImageUpload"
import { useAtomValue, useSetAtom } from "jotai"
import { showAddTransactionModalAtom, userInfoAtom } from "@/states/dashboard.states"
import { useState } from "react"
import EmptyText from "../EmptyText/EmptyText"
import UserMessage from "../UserMessage/UserMessage"
import AIMessage from "../AIMessage/AIMessage"

type userMessage =  {
    messageTyped : string;
    profilePicture : string;
    from : "USER"
}

type aiMessage = {
    messageToPerformAction : string
    from : "AI"
}

function AddNewEntryModal() {
    const setShowModal = useSetAtom(showAddTransactionModalAtom)
    const imageUserUploaded = null
    const [messages, setMessages] = useState<(userMessage | aiMessage)[]>([])
    const [userMessage, setUserMessage] = useState("")
    const userInfo = useAtomValue(userInfoAtom)

    async function submitUserMessage(){
        const userMessageObject: userMessage = {
            messageTyped : userMessage,
            profilePicture : userInfo?.user.image as string,
            from : "USER"
        }

        const aiMessageObject: aiMessage = {
            messageToPerformAction : userMessage,
            from : "AI"
        }

        setMessages((prev)=> [...prev, userMessageObject, aiMessageObject])
        setUserMessage("")
    }

   const mappedMessages = messages.map((message, index) => {
    if (message.from === "USER") {
        return (
            <UserMessage 
                key={index}
                messageTyped={message.messageTyped} 
                profilePicture={message.profilePicture} 
            />
        );
    } else if(message.from == "AI"){
        return (
            <AIMessage
            key={index}
            messageToPerformAction={message.messageToPerformAction}
            />
        )
    }
});

  return (
    <div className="modal-bg">
        <div className="add-entry-modal">
            <header>
                <Image 
                src={addIcon}
                alt="add icon"
                />

                <div className="add-entry-modal-header-text">
                    <h3>Add a new Entry</h3>
                    <p>Create a new entry using natural language</p>
                </div>

                    <button
                    onClick={()=>setShowModal(false)}
                    >
                 <Image 
                src={closeModalIcon}
                alt="close icon"
                />                        
                    </button>
            </header>

           <div className="add-entry-messages">
            {messages.length === 0?   
            <EmptyText 
            textToDisplay="What did you spend your money on?" 
            />
                :
                mappedMessages
        }
           </div>

           {imageUserUploaded && <EntryImageUpload />}

           <form 
           onSubmit={(e)=>{
                e.preventDefault()
                submitUserMessage()
           }}
           className="add-entry-form">
            <div className="input-container">
                <input 
                value={userMessage}
                onChange={(e)=>{
                    setUserMessage(e.target.value)
                }}
                required 
                name="entry"
                id="entry"
                type="text" placeholder='Today I bought...' />

                <button type="button">
                <Image 
                alt="image icon"
                src={imageIcon}
                />
                </button>
            </div>

            <button 
            disabled={userMessage.length == 0}
            >
                <Image 
                alt="send"
                src={sendIcon}
                />
            </button>
           </form>
        </div>
    </div>
  )
}

export default AddNewEntryModal