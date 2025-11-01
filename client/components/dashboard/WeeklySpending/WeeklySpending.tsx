import { formatNumber } from '@/libs/format';
import React, { useEffect, useState } from 'react'
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

function WeeklySpending() {
    const [fetchStatus, setFetchStatus] = useState<'loading' | 'error' | 'success'>('loading');
    const [data, setData] = useState<number>(0);
    
     async function getThisWeeksTransaction(){
    try{
      setFetchStatus('loading');
      const response = await fetch(`${BASE_URL}/api/transactions/week`,{
        credentials : "include"
      })
      if (!response.ok) throw new Error("Network response was not ok")
      const data = await response.json()
      setFetchStatus('success');
      setData(data.total);
    }
    catch(err){
      setFetchStatus('error');
      console.log(err)
    }
  }

  useEffect(()=>{
    getThisWeeksTransaction()
  }, [])
  return (
    <div className="single-spending-card">
      {fetchStatus === 'loading' && <h2>Loading...</h2>}
      {fetchStatus === 'error' && <h2>Error</h2>}
      {fetchStatus === 'success' && <h2>${formatNumber(data)}</h2>}
      <p>SPENT THIS WEEK</p>
    </div>
  )
}

export default WeeklySpending