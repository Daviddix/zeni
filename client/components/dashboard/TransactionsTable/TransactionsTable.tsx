import { useEffect, useState } from "react";
import "./TransactionsTable.css"
import { useSetAtom } from "jotai";
import { allExpensesAtom } from "@/states/dashboard.states";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

type transactionType = {
    id : string;
    name : string;
    amount : number;
    date : string;
    category : string;
}


function TransactionsTable({tableTitle} : {tableTitle?: string}) {
  const [transactions, setTransactions] = useState<transactionType[]>([]);
  const [fetchStatus, setFetchStatus] = useState<"loading" | "error" | "success">("loading");
  const setAllExpenses = useSetAtom(allExpensesAtom);

    async function getUserTransactions(){
    try{
        const response = await fetch(`${BASE_URL}/api/transactions/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials : "include",
        });
        const responseInJson = await response.json();

        if (!response.ok) {
            throw new Error(responseInJson.message || "Unknown error occurred");
        }
        setTransactions(responseInJson.expenses);
        setAllExpenses(responseInJson.expenses);
        setFetchStatus("success");
    }
    catch(err){
        console.log("Error fetching user transactions from backend:", err);
        setFetchStatus("error");
    }
  }

  const mappedTransactions = transactions.map((transaction)=>{
    return (
        <tr key={transaction.id}>
          <td>
            <div className="transaction-cell">
              <div className="avatar">MB</div>
              <span className="name">{transaction.name}</span>
            </div>
          </td>
          <td>${transaction.amount.toFixed(2)}</td>
          <td>{new Date(transaction.date).toLocaleDateString()}</td>
          <td><span className="badge">{transaction.category}</span></td>
        </tr>
    );
  });

  useEffect(()=>{
    getUserTransactions();
  }, [])

  return (
    <div className="table-card">
    <div className="table-card-header gray-header">
      <p className="caps-gray-text">{tableTitle}</p>
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
      {fetchStatus === "loading" ? (
        <tr>
          <td colSpan={4} style={{ textAlign: "center" }}>
            Loading transactions...
          </td>
        </tr>
      ) : fetchStatus === "error" ? (
        <tr>
          <td colSpan={4} style={{ textAlign: "center" }}>
            Error loading transactions.
          </td>
        </tr>
      ) : (
        mappedTransactions
      )}
      </tbody>
    </table>
        </div>
  )
}

export default TransactionsTable