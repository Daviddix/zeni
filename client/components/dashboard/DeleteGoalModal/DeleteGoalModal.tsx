import Image from "next/image"
import "./DeleteGoalModal.css"
import deleteIcon from "@/public/images/delete-modal-icon.svg"

function DeleteGoalModal() {
  return (
    <div className="modal-bg">
        <div className="delete-goal-modal">
            <header>
                <Image 
                src={deleteIcon}
                alt="delete icon"
                />

                <h2>Delete Budget Goal</h2>
            </header>

            <p>Are you sure you want to delete this budget goal? This action cannot be reversed</p>

            <div className="actions">
                <button>Cancel</button>
                <button className="destructive">Delete</button>
            </div>
        </div>
    </div>
  )
}

export default DeleteGoalModal