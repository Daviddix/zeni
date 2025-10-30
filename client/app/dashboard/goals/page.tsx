"use client"

import SingleGoal from "@/components/dashboard/SingleGoal/SingleGoal"
import "./goals.css"
import addIcon from "@/public/images/add-dark-icon.svg"
import downIcon from "@/public/images/down-icon.svg"
import zeniAiIcon from "@/public/images/zeni-ai-icon.svg"
import Image from "next/image"
import DeleteGoalModal from "@/components/dashboard/DeleteGoalModal/DeleteGoalModal"
import AddGoalModal from "@/components/dashboard/AddGoalModal/AddGoalModal"
import { useEffect, useState } from "react"
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

function Goals() {
  const [allGoals, setAllGoals] = useState([]);
  const [fetchingStatus, setFetchingStatus] = useState<"loading" | "error" | "success">("loading");
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  async function getUserGoals(){
    setFetchingStatus("loading");
    try{
      const response = await fetch(`${BASE_URL}/api/goals/all`,{
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch goals");
      const data = await response.json();
      setAllGoals(data.goals);
      setFetchingStatus("success");
    }catch(err){
      setFetchingStatus("error");
      console.error("Error fetching goals:", err);
    }
  }

  const mappedGoals = allGoals.map((goal:any)=>(
    <SingleGoal 
    key={goal.id}
    />
  ));

  useEffect(()=>{
    getUserGoals();
  }, [])

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
        <button 
        onClick={() => setShowAddGoalModal(true)}
        className="new-goal">
          <Image
          src={addIcon}
          alt="add icon"
          />
          <p>Add new Goal</p>
        </button>

        <div className="budget-goals-container">
         {
          fetchingStatus === "loading" ? (
            <p>Loading goals...</p>
          ) : fetchingStatus === "error" ? (
            <p>Error fetching goals</p>
          ) : (
            mappedGoals.length > 0 ? (
              mappedGoals
            ) : (
              <p className="empty-text">No goals set yet. Click &quot;Add new Goal&quot; to create one.</p>
            )
          )
        }
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

      {/* <DeleteGoalModal /> */}
      {showAddGoalModal && <AddGoalModal 
      setShowAddGoalModal={setShowAddGoalModal}
      />}

    </main>
  )
}

export default Goals