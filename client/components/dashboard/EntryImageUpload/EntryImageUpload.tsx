
import Image from 'next/image'
import "./EntryImageUpload.css"
import closeModalIcon from "@/public/images/close-icon.svg"
import placeholderImage from "@/public/images/placeholder-image.png"

function EntryImageUpload() {
  return (
    <div className="entry-image-upload">
        <Image src={placeholderImage} alt="image you uploaded" className='uploaded-image' />

        <div className="image-info">
            <h3>Receipt Image-1234.jpg</h3>
            <small>12.3kb</small>
        </div>

        <button className='close'>
        <Image 
        src={closeModalIcon}
        alt="close icon"
        />
        </button>
    </div>
  )
}

export default EntryImageUpload