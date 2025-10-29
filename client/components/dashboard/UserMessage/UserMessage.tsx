import Image from "next/image";
import "./UserMessage.css"

type userMessageProps = {
    profilePicture : string;
    messageTyped : string;
}

function UserMessage({profilePicture, messageTyped} : userMessageProps) {
  return (
    <div className="user-message">
    <Image 
    width={30}
    height={30}
    src={profilePicture}
    alt="your profile picture"
    />

    <p>{messageTyped}</p>
    </div>
  )
}

export default UserMessage