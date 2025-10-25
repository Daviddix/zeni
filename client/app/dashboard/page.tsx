import SingleGoal from "@/components/dashboard/SingleGoal/SingleGoal"
import "./dashboard.css"

function page() {
  return (
    <main className="overview-main">
      <div className="left-side">

        <header className="left-side-header">
          <p>Monday 25th October, 2025</p>
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

        <div className="table-card">
    <div className="table-card-header gray-header">
      <p className="caps-gray-text">Last 3 Entries</p>
      </div>

    <table className="transaction-table">
      <thead>
        <tr>
          <th>Transaction</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div className="transaction-cell">
              <div className="avatar">MB</div>
              <span className="name">Mr Biggs Restaurant</span>
            </div>
          </td>
          <td>$231.45</td>
          <td>Monday, October 12</td>
          <td><span className="badge">Food</span></td>
        </tr>
        <tr>
          <td>
            <div className="transaction-cell">
              <div className="avatar">MB</div>
              <span className="name">Mr Biggs Restaurant</span>
            </div>
          </td>
          <td>$231.45</td>
          <td>Monday, October 12</td>
          <td><span className="badge">Food</span></td>
        </tr>
        <tr>
          <td>
            <div className="transaction-cell">
              <div className="avatar">MB</div>
              <span className="name">Mr Biggs Restaurant</span>
            </div>
          </td>
          <td>$231.45</td>
          <td>Monday, October 12</td>
          <td><span className="badge">Food</span></td>
        </tr>
      </tbody>
    </table>
        </div>

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

export default page