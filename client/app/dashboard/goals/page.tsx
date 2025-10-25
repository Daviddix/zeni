import SingleGoal from "@/components/dashboard/SingleGoal/SingleGoal"
import "./goals.css"
import addIcon from "@/public/images/add-dark-icon.svg"
import downIcon from "@/public/images/down-icon.svg"
import zeniAiIcon from "@/public/images/zeni-ai-icon.svg"
import Image from "next/image"

function page() {
  return (
    <main className="goals-main">
      <button className="zeni-ai-button">
        <Image
          src={zeniAiIcon}
          alt="add icon"
          />
      </button>

      <header className="goals-main-header">
        <p>Monday, 25th October, 2023</p>
        <h1>Set Budget Goals</h1>
      </header>

      <div className="goals-ai-container">
      <div className="all-goals-container">
        <button className="new-goal">
          <Image
          src={addIcon}
          alt="add icon"
          />
          <p>Add new Goal</p>
        </button>

        <div className="budget-goals-container">
          <SingleGoal />
          <SingleGoal />
          <SingleGoal />
        </div>
      </div>

      <div className="ai-analysis-goals">

        <div className="ai-analysis-content">
        <header>
          <p>AI ANALYSIS</p>

          <button>
          <Image 
          alt="minimize"
          src={downIcon}
          />
          </button>

        </header>

        <div className="ai-analysis-body">
          <h1 className="empty-text">Select a budget goal to see an analysis for it</h1>
        </div>

        </div>

      </div>

      </div>

    </main>
  )
}

export default page