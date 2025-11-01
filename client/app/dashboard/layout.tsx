"use client";

import Image from "next/image";
import logo from "@/public/images/logo.svg"
import "./dashboard.global.css"
import Sidebar from "@/components/dashboard/Sidebar/Sidebar";
import AddNewEntryModal from "@/components/dashboard/AddNewEntryModal/AddNewEntryModal"
import { useAtomValue, useSetAtom } from "jotai";
import { showAddTransactionModalAtom, userInfoAtom } from "@/states/dashboard.states";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL
import { useEffect } from "react"



export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const showAddNewEntryModal = useAtomValue(showAddTransactionModalAtom)
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
    <>
    <header className="dashboard-header">
      <Image 
      src={logo}
      alt="Zeni logo"
      />
    </header>

      <main className="dashboard-main">

     {showAddNewEntryModal && <AddNewEntryModal />}
        <Sidebar />
        {children}
      </main>
    </>
  );
}
