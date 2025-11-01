import Image from "next/image"
import "./SingleGoal.css"
import deleteIcon from "@/public/images/goal-delete-icon.svg"

type singleGoalProps = {
    name : string,
    total_remaining : number,
    progress_remaining : number,
    total_spent : number,
    progress_completed : number,
    goal_amount : number,
}

function SingleGoal({ name, total_remaining, progress_remaining, total_spent, progress_completed, goal_amount }: singleGoalProps) {
  return (
    <div className="single-budget-goal">
              <header>
                <p>{name}</p>

                <button>
                  <Image 
                  alt="delete goal"
                  src={deleteIcon}
                  />
                </button>
              </header>

              <div className="budget-details">
                <h2>{Math.round((progress_completed / goal_amount) * 100)}%</h2>

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
                    <p>${total_spent} <small>spent</small></p>
                  </div>

                  <div className="remaining">
                    <p>${total_remaining} <small>remaining</small></p>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default SingleGoal