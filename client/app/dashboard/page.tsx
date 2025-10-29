"use client"
import SingleGoal from "@/components/dashboard/SingleGoal/SingleGoal"
import "./dashboard.css"
import TransactionsTable from "@/components/dashboard/TransactionsTable/TransactionsTable"
import TodaysDate from "@/components/dashboard/TodaysDate/TodaysDate"
import { useEffect } from "react"
import { useSetAtom } from "jotai"
import { userInfoAtom } from "@/states/dashboard.states"
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

function DashboardPage() {
  const setUserInfo = useSetAtom(userInfoAtom)

  async function getUserInfo(){
    try{
      const rawFetch = await fetch(`${BASE_URL}/api/users/info`, {
        credentials : "include"
      })

      const responseInJson : userDetailsType = await rawFetch.json()

      if(!rawFetch.ok){
        throw new Error("Couldn't get user information")
      }

      setUserInfo(responseInJson)
    }
    catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    getUserInfo()
  }, [])
  return (
    <main className="overview-main">
      <div className="left-side">

        <header className="left-side-header">
          <TodaysDate />
          <h1>Welcome back, Here&apos;s your Overview</h1>
        </header>

        <div className="spending-card-container">
          <div className="single-spending-card">
            <h2>$32</h2>
            <p>SPENT TODAY</p>
          </div>

           <div className="single-spending-card">
            <h2>$127</h2>
            <p>SPENT THIS WEEK</p>
          </div>

           <div className="single-spending-card">
            <h2>$310</h2>
            <p>SPENT THIS MONTH</p>
          </div>
        </div>

        <TransactionsTable />

        <div className="budget-goals">
          <h1>Budget Goals</h1>

          <div className="budget-goals-container">
             <SingleGoal />
             <SingleGoal />
          </div>
        </div>
      </div>

      <div className="right-side">
        <div className="spending-by-category">
          <header className="gray-header">
            <h2 className="caps-gray-text">SPENDING BY CATEGORY</h2>
          </header>
          
          <div className="chart-container"></div>

          <div className="chart-items">
            <div className="single-chart-item">
              <span className="square"></span>
              <p>Food</p>
            </div>

            <div className="single-chart-item">
              <span className="square"></span>
              <p>Electronics</p>
            </div>

            <div className="single-chart-item">
              <span className="square"></span>
              <p>Transportation</p>
            </div>

            <div className="single-chart-item">
              <span className="square"></span>
              <p>Misc.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardPage