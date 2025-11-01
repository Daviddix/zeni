import Image from "next/image"
import "./AddGoalModal.css"
import addIcon from "@/public/images/add-new-goal-icon.svg"
import closeModalIcon from "@/public/images/close-icon.svg"
import { Dispatch, SetStateAction, useState } from "react"

type addGoalModalProps = {
  setShowAddGoalModal: Dispatch<SetStateAction<boolean>>
}

function AddGoalModal({ setShowAddGoalModal }: addGoalModalProps) {
  const [goalTyped, setGoalTyped] = useState("")

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
            onChange={(e) => setGoalTyped(e.target.value)}></textarea>

            <button 
            disabled={goalTyped.trim().length === 0}
            className="primary-button">Add Goal</button>
           </form>
        </div>
    </div>
  )
}

export default AddGoalModal