import "./TransactionsTable.css"

function TransactionsTable() {
  return (
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
  )
}

export default TransactionsTable