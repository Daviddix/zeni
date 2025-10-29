"use client";

import Image from "next/image";
import logo from "@/public/images/logo.svg"
import "./dashboard.global.css"
import Sidebar from "@/components/dashboard/Sidebar/Sidebar";
import AddNewEntryModal from "@/components/dashboard/AddNewEntryModal/AddNewEntryModal"
import { useAtomValue } from "jotai";
import { showAddTransactionModalAtom } from "@/states/dashboard.states";



export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const showAddNewEntryModal = useAtomValue(showAddTransactionModalAtom)


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
