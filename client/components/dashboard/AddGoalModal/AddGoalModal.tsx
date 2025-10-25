import Image from "next/image"
import "./AddGoalModal.css"
import addIcon from "@/public/images/add-new-goal-icon.svg"
import closeModalIcon from "@/public/images/close-icon.svg"

function AddGoalModal() {
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

                    <button>
                 <Image 
                src={closeModalIcon}
                alt="close icon"
                />                        
                    </button>
            </header>

           <form className="add-goal-form">
            <textarea placeholder="I want to spend less than..."></textarea>

            <button 
            disabled
            className="primary-button">Add Goal</button>
           </form>
        </div>
    </div>
  )
}

export default AddGoalModal