"use client"
import SingleGoal from "@/components/dashboard/SingleGoal/SingleGoal"
import "./dashboard.css"
import TransactionsTable from "@/components/dashboard/TransactionsTable/TransactionsTable"
import TodaysDate from "@/components/dashboard/TodaysDate/TodaysDate"
import DailySpending from "@/components/dashboard/DailySpending/DailySpending"
import WeeklySpending from "@/components/dashboard/WeeklySpending/WeeklySpending"
import MonthlySpending from "@/components/dashboard/MonthlySpending/MonthlySpending"
import PieChartWithCustomizedLabel from "@/components/dashboard/CategoryPieChart/CategoryPieChart"
import { allExpensesAtom } from "@/states/dashboard.states"
import { useAtomValue } from "jotai"
import { normalizeData } from "@/libs/normalize"
// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

function DashboardPage() {
  const allExpenses = useAtomValue(allExpensesAtom);


  const mappedExpensesCategories = normalizeData(allExpenses).map((expense)=>{
    return <div key={expense.category} className="single-chart-item">
              <span className="square"></span>
              <p>{expense.category}</p>
            </div>
  })
  return (
    <main className="overview-main">
      <div className="left-side">

        <header className="left-side-header">
          <TodaysDate />
          <h1>Welcome back, Here&apos;s your Overview</h1>
        </header>

        <div className="spending-card-container">
          <DailySpending />

          <WeeklySpending />

           <MonthlySpending />
        </div>

        <TransactionsTable tableTitle="LAST 3 ENTRIES" />

      </div>

      <div className="right-side">
        <div className="spending-by-category">
          <header className="gray-header">
            <h2 className="caps-gray-text">SPENDING BY CATEGORY</h2>
          </header>
          
            <PieChartWithCustomizedLabel allExpenses={allExpenses} />

          <div className="chart-items">
            {mappedExpensesCategories}
          </div>
        </div>
      </div>
    </main>
  )
}

export default DashboardPage