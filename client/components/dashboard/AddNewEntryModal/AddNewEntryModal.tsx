import "./AddNewEntryModal.css"
import Image from 'next/image'
import addIcon from "@/public/images/add-new-goal-icon.svg"
import closeModalIcon from "@/public/images/close-icon.svg"
import imageIcon from "@/public/images/image-icon.svg"
import sendIcon from "@/public/images/send-icon.svg"
import EntryImageUpload from "../EntryImageUpload/EntryImageUpload"
import { useAtomValue, useSetAtom } from "jotai"
import { showAddTransactionModalAtom, userInfoAtom } from "@/states/dashboard.states"
import { useState, useRef } from "react"
import EmptyText from "../EmptyText/EmptyText"
import UserMessage from "../UserMessage/UserMessage"
import AIMessage from "../AIMessage/AIMessage"

type userMessage =  {
    messageTyped : string;
    profilePicture : string;
    imageData : UploadedImage | null
    from : "USER"
}

type aiMessage = {
    messageToPerformAction : string,
    from : "AI",
     imageData : UploadedImage | null
}

type UploadedImage = {
    file: File;
    previewUrl: string;
    name: string;
    size: number;
}

function AddNewEntryModal() {
    const setShowModal = useSetAtom(showAddTransactionModalAtom)
    const [imageUserUploaded, setImageUserUploaded] = useState<UploadedImage | null>(null)
    const [messages, setMessages] = useState<(userMessage | aiMessage)[]>([])
    const [userMessage, setUserMessage] = useState("")
    const userInfo = useAtomValue(userInfoAtom)
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleImageButtonClick() {
        fileInputRef.current?.click()
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file')
                return
            }

            // Create preview URL
            const previewUrl = URL.createObjectURL(file)

            setImageUserUploaded({
                file,
                previewUrl,
                name: file.name,
                size: file.size
            })
        }
    }

    function removeImage() {
        if (imageUserUploaded?.previewUrl) {
            URL.revokeObjectURL(imageUserUploaded.previewUrl)
        }
        setImageUserUploaded(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    async function submitUserMessage(){
        const userMessageObject: userMessage = {
            messageTyped : userMessage,
            profilePicture : userInfo?.user.image as string,
            from : "USER",
            imageData: imageUserUploaded
        }

        const aiMessageObject: aiMessage = {
            messageToPerformAction : userMessage,
            from : "AI",
            imageData: imageUserUploaded
        }

        setMessages((prev)=> [...prev, userMessageObject, aiMessageObject])
        setUserMessage("")
        setImageUserUploaded(null)
    }

   const mappedMessages = messages.map((message, index) => {
    if (message.from === "USER") {
        return (
            <UserMessage 
                key={index}
                messageTyped={message.messageTyped} 
                profilePicture={message.profilePicture} 
                imageData={message.imageData}
            />
        );
    } else if(message.from == "AI"){
        return (
            <AIMessage
            key={index}
            imageData={message.imageData}
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

           {imageUserUploaded && (
            <EntryImageUpload 
                imageUrl={imageUserUploaded.previewUrl}
                imageName={imageUserUploaded.name}
                imageSize={imageUserUploaded.size}
                onRemove={removeImage}
            />
           )}

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

                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept=".jpg, .jpeg"
                    style={{ display: 'none' }}
                />

                <button 
                    type="button"
                    onClick={handleImageButtonClick}
                >
                <Image 
                alt="image icon"
                src={imageIcon}
                />
                </button>
            </div>

            <button 
            disabled={userMessage.length == 0 && !imageUserUploaded}
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