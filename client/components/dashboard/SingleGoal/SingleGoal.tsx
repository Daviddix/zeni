import Image from "next/image"
import "./SingleGoal.css"
import deleteIcon from "@/public/images/goal-delete-icon.svg"

function SingleGoal() {
  return (
    <div className="single-budget-goal">
              <header>
                <p>Spend less than $100 this week</p>

                <button>
                  <Image 
                  alt="delete goal"
                  src={deleteIcon}
                  />
                </button>
              </header>

              <div className="budget-details">
                <h2>80%</h2>

                <div className="progress-bar">
                  <div className="done"></div>
                  <div className="remaining"></div>
                </div>

                <div className="price-details">
                  <div className="spent">
                    <p>$80 <small>spent</small></p>
                  </div>

                  <div className="remaining">
                    <p>$20 <small>remaining</small></p>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default SingleGoal