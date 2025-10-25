"use client";

import Image from "next/image";
import logo from "@/public/images/logo.svg"
import "./dashboard.global.css"
import Sidebar from "@/components/dashboard/Sidebar/Sidebar";


export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <>
    <header className="dashboard-header">
      <Image 
      src={logo}
      alt="Zeni logo"
      />
    </header>

      <main className="dashboard-main">

        <Sidebar />
        {children}
      </main>
    </>
  );
}
