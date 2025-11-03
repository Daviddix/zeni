import { formatNumber } from "@/libs/format";
import { userInfoAtom } from "@/states/dashboard.states";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react"

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

function DailySpending() {
    const [fetchStatus, setFetchStatus] = useState<'loading' | 'error' | 'success'>('loading');
    const [data, setData] = useState<number>(0);
    const userInfo = useAtomValue(userInfoAtom)
    const userCurrencySymbol = userInfo?.user.currency.symbol
    async function getTodaysTransaction(){
    try{
      setFetchStatus('loading');
      const response = await fetch(`${BASE_URL}/api/transactions/today`,{
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
    getTodaysTransaction()
  }, [])

  return (
    <div className="single-spending-card">
            {fetchStatus === 'loading' && <h2>Loading...</h2>}
            {fetchStatus === 'error' && <h2>Error</h2>}
            {fetchStatus === 'success' && <h2>{userCurrencySymbol}{formatNumber(data)}</h2>}
            <p>SPENT TODAY</p>
          </div>
  )
}

export default DailySpending