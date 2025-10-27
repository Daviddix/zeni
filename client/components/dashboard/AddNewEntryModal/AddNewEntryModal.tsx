import "./AddNewEntryModal.css"
import Image from 'next/image'
import addIcon from "@/public/images/add-new-goal-icon.svg"
import closeModalIcon from "@/public/images/close-icon.svg"
import imageIcon from "@/public/images/image-icon.svg"
import sendIcon from "@/public/images/send-icon.svg"
import EntryImageUpload from "../EntryImageUpload/EntryImageUpload"

function AddNewEntryModal() {
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

                    <button>
                 <Image 
                src={closeModalIcon}
                alt="close icon"
                />                        
                    </button>
            </header>

           <div className="add-entry-messages">
            <h1 className="empty-text">What did you spend your money on?</h1>
           </div>

           <EntryImageUpload />

           <form className="add-entry-form">
            <div className="input-container">
                <input required 
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

            <button>
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