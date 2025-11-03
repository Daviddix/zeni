
import Image from 'next/image'
import "./EntryImageUpload.css"
import closeModalIcon from "@/public/images/close-icon.svg"

type EntryImageUploadProps = {
    imageUrl: string;
    imageName: string;
    imageSize: number;
    onRemove: () => void;
}

function EntryImageUpload({ imageUrl, imageName, imageSize, onRemove }: EntryImageUploadProps) {
  // Format file size to KB or MB
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }
  }

  return (
    <div className="entry-image-upload">
        <Image 
          src={imageUrl} 
          alt="image you uploaded" 
          className='uploaded-image'
          width={100}
          height={100}
        />

        <div className="image-info">
            <h3>{imageName}</h3>
            <small>{formatFileSize(imageSize)}</small>
        </div>

        <button 
          className='close'
          onClick={onRemove}
          type="button"
        >
        <Image 
        src={closeModalIcon}
        alt="close icon"
        />
        </button>
    </div>
  )
}

export default EntryImageUpload