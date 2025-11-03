"use client";

import SingleGoal from "@/components/dashboard/SingleGoal/SingleGoal";
import "./goals.css";
import addIcon from "@/public/images/add-dark-icon.svg";
import downIcon from "@/public/images/down-icon.svg";
import zeniAiIcon from "@/public/images/zeni-ai-icon.svg";
import Image from "next/image";
import DeleteGoalModal from "@/components/dashboard/DeleteGoalModal/DeleteGoalModal";
import AddGoalModal from "@/components/dashboard/AddGoalModal/AddGoalModal";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { allBudgetGoalsAtom } from "@/states/dashboard.states";
import EmptyText from "@/components/dashboard/EmptyText/EmptyText";
import TodaysDate from "@/components/dashboard/TodaysDate/TodaysDate";
import Markdown from "react-markdown";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function Goals() {
  const [allGoals, setAllGoals] = useState<goalsType[]>([]);
  const [fetchingStatus, setFetchingStatus] = useState<
    "loading" | "error" | "success"
  >("loading");
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const setGoalsAtom = useSetAtom(allBudgetGoalsAtom);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [showAiPopup, setShowAIPopup] = useState(false)

  async function getUserGoals() {
    setFetchingStatus("loading");
    try {
      const response = await fetch(`${BASE_URL}/api/goals/all`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch goals");
      const data = await response.json();
      setAllGoals(data.goals);
      setGoalsAtom(data.goals);
      setFetchingStatus("success");
    } catch (err) {
      setFetchingStatus("error");
      console.error("Error fetching goals:", err);
    }
  }
  const [sendingStatus, setSendingStatus] = useState<"sending" | "idle" | "error" | "completed">("idle");

  const mappedGoals = allGoals.map((goal) => (
    <SingleGoal
      key={goal.id}
      name={goal.name}
      total_remaining={goal.total_remaining}
      progress_remaining={goal.progress_remaining}
      total_spent={goal.total_spent}
      progress_completed={goal.progress_completed}
      goal_amount={goal.goal_amount}
      setSelectedGoal={setSelectedGoal}
      id={goal.id}
      sendMessageToBackend={() => sendMessageToBackend(goal.id)}
      isDisabled={sendingStatus === "sending" && selectedGoal !== goal.id}
      isSelected={selectedGoal === goal.id}
    />
  ));

  const mappedSelectedGoal = allGoals.find((goal) => goal.id === selectedGoal);

  useEffect(() => {
    getUserGoals();
  }, []);


  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string>("");

  async function createAISession() {
    try {
      const response = await fetch(`${BASE_URL}/api/goals/ai/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      });

      const responseInJson = await response.json();

      if (!response.ok) {
        setErrorMessage(responseInJson.message || "Unknown error occurred");
        setSendingStatus("error");
        throw new Error("AI agent error", { cause: responseInJson });
      }

      console.log("AI session response:", responseInJson);
      return responseInJson.sessionId;
    } catch (err) {
      setSendingStatus("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to communicate with AI agent.");
      }
      console.log("Error sending message to backend:", err);
    }
  }

  async function sendMessageToBackend(goalId: string) {
    setResponseMessage("")
    const goal = allGoals.find((g) => g.id === goalId);
    console.log("Selected goal ID:", goal?.id);
    setSendingStatus("sending");
    try {
      const sessionId = await createAISession();
      const response = await fetch(`${BASE_URL}/api/goals/ai/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ sessionId, userText: goal?.id }),
      });

      const responseInJson = await response.json();

      if (!response.ok) {
        setErrorMessage(responseInJson.message || "Unknown error occurred");
        setSendingStatus("error");
        throw new Error("AI agent error", { cause: responseInJson });
      }

      const textToDisplay =
        responseInJson.agentResponse?.[5]?.content?.parts?.[0]?.text ??
        "No analysis available for the selected goal.";
      setSendingStatus("completed");
      console.log(textToDisplay);
      setResponseMessage(textToDisplay);
      setResponseMessage(textToDisplay);
    } catch (err) {
      setSendingStatus("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Failed to communicate with AI agent.");
      }
      console.log("Error sending message to backend:", err);
    }
  }

  return (
    <main className="goals-main">
      <button 
       onClick={()=>{
          setShowAIPopup(true)
        }}
      className="zeni-ai-button">
        <Image src={zeniAiIcon} alt="add icon" />
      </button>

      <header className="goals-main-header">
        <TodaysDate />
        <h1>Set Budget Goals</h1>
      </header>

      <div className="goals-ai-container">
        <div className="all-goals-container">
          <button
            onClick={() => setShowAddGoalModal(true)}
            className="new-goal"
          >
            <Image src={addIcon} alt="add icon" />
            <p>Add new Goal</p>
          </button>

          <div className="budget-goals-container">
            {fetchingStatus === "loading" ? (
              <p>Loading goals...</p>
            ) : fetchingStatus === "error" ? (
              <p>Error fetching goals</p>
            ) : mappedGoals.length > 0 ? (
              mappedGoals
            ) : (
              <p className="empty-text">
                No goals set yet. Click &quot;Add new Goal&quot; to create one.
              </p>
            )}
          </div>
        </div>

        <div className={showAiPopup ? "ai-analysis-goals" : "ai-analysis-goals hidden"}>
          <div className="ai-analysis-content">
            <header>
              <p>AI ANALYSIS</p>

              <button
                onClick={()=>{
          setShowAIPopup(false)
        }}
              >
                <Image alt="minimize" src={downIcon} />
              </button>
            </header>

            <div className="ai-analysis-body">
              {responseMessage? (
                <div className="ai-response-message">
                  <p className="goal-ana">
                    <Markdown>
                    {responseMessage}
                    </Markdown>
                    </p>
                </div>
              ):
              sendingStatus === "sending" ? (
                <p className="loading-text">Analyzing your goal...</p>
              ) : sendingStatus === "error" ? (
                <p className="error-text">Error: {errorMessage}</p>
              ) :
              <EmptyText textToDisplay="Select a budget goal to see an analysis for it" />
              }
            </div>
          </div>
        </div>
      </div>

      {/* <DeleteGoalModal /> */}
      {showAddGoalModal && (
        <AddGoalModal 
          setShowAddGoalModal={setShowAddGoalModal} 
          onSuccess={() => {
            getUserGoals(); // Refresh goals list
          }}
          onShowSuccessMessage={(message) => {
            setSuccessMessage(message);
            // Auto-hide success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
          }}
        />
      )}
      
      {successMessage && (
        <div className="success-toast">
          <p>✓ {successMessage}</p>
        </div>
      )}
    </main>
  );
}

export default Goals;
