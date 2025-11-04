import Image from "next/image"
import "./SingleGoal.css"
import deleteIcon from "@/public/images/goal-delete-icon.svg"
import { Dispatch, SetStateAction } from "react"

type singleGoalProps = {
    name : string,
    total_remaining : number,
    progress_remaining : number,
    total_spent : number,
    progress_completed : number,
    goal_amount : number,
    setSelectedGoal? : Dispatch<SetStateAction<string | null>>,
    id : string,
    sendMessageToBackend : (id:string) => Promise<void>,
    isDisabled? : boolean,
    isSelected? : boolean,
    userCurrencySymbol : string,
    onDeleteClick : (goalId: string, goalName: string) => void
}

function SingleGoal({ name, userCurrencySymbol, total_remaining, progress_remaining, total_spent, progress_completed, goal_amount, setSelectedGoal, id, sendMessageToBackend, isDisabled = false, isSelected = false, onDeleteClick }: singleGoalProps) {
  return (
    <div 
    onClick={()=>{
      if(setSelectedGoal && !isDisabled){
        setSelectedGoal(id)
        sendMessageToBackend(id)
      }
    }}
    className={`single-budget-goal ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
    style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
              <header>
                <p>{name}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the goal selection
                    onDeleteClick(id, name);
                  }}
                >
                  <Image 
                  alt="delete goal"
                  src={deleteIcon}
                  />
                </button>
              </header>

              <div className="budget-details">
                <h2>{progress_completed}%</h2>

                <div className="progress-bar" style={
                  {
                    gridTemplateColumns : `1fr ${progress_remaining}%`
                  }
                }>
                  <div className="done"></div>
                  <div className="remaining"></div>
                </div>

                <div className="price-details">
                  <div className="spent">
                    <p>{userCurrencySymbol}{total_spent} <small>spent</small></p>
                  </div>

                  <div className="remaining">
                    <p>{userCurrencySymbol}{total_remaining} <small>remaining</small></p>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default SingleGoal