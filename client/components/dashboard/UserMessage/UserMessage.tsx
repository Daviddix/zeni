import Image from "next/image";
import "./UserMessage.css"

type UploadedImage = {
    file: File;
    previewUrl: string;
    name: string;
    size: number;
}

type userMessageProps = {
    profilePicture : string;
    messageTyped : string;
    imageData : UploadedImage | null;
}

function UserMessage({profilePicture, messageTyped, imageData} : userMessageProps) {
  if(imageData){
    return (
      <div className="user-message">
      <Image 
      width={30}
      height={30}
      src={profilePicture}
      alt="your profile picture"
      />

      <p>{messageTyped}</p>
      <p>{imageData.name}</p>
      <Image
      width={100}
      height={100}
      className="pic"
      src={imageData.previewUrl}
      alt={imageData.name}
      />
    </div> )
  }
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