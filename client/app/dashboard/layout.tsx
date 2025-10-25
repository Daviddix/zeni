"use client";

import Image from "next/image";
import logo from "@/public/images/logo.svg"
import plusIcon from "@/public/images/add-icon.svg"
import "./dashboard.global.css"
import OverviewIcon from "@/components/dashboard/OverviewIcon/OverviewIcon";
import GoalsIcon from "@/components/dashboard/GoalsIcon/GoalsIcon";
import EntriesIcon from "@/components/dashboard/EntriesIcon/EntriesIcon";
import SingleNavLink from "@/components/dashboard/SingleNavLink/SingleNavLink";
import { usePathname } from "next/navigation";
import AddIcon from "@/components/dashboard/AddIcon/AddIcon";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const linksData = [{
    href : "/dashboard",
    text : "Overview",
    Icon : OverviewIcon,
  },
{
    href : "/dashboard/goals",
    text : "budget Goals",
    Icon : GoalsIcon,
  },
  
  {
    text : "Main Button",
    Icon : AddIcon,
  },
{
    href : "/dashboard/entries",
    text : "Your Entries",
    Icon : EntriesIcon,
  }]
  const currentPath = usePathname();

  const mappedLinkData = linksData.map((data)=>{
    return <SingleNavLink
    currentPath={currentPath}
    text={data.text}
    href={data.href}
    Icon={data.Icon}
    key={data.text}
    />
  })
  return (
    <>
    <header className="dashboard-header">
      <Image 
      src={logo}
      alt="Zeni logo"
      />
    </header>

      <main className="dashboard-main">

        <aside className="dashboard-sidebar">

          <div className="main-button">

          <button className="primary-button">
            <Image 
            src={plusIcon}
            alt="plus icon"
            />
            New Entry
          </button>

          </div>

          <div className="links-container">
            <p className="dashboard-links-heading">GENERAL</p>

            <nav>
              {mappedLinkData}   
              <Image 
              src=""
              
              width={40}
              height={40}
              alt="profile picture"
              />   
            </nav>
          </div>

          <div className="profile-section">
            <Image 
            width={20}
            height={20}
            alt="Your profile picture"
            src=""
            />

            <p>Logout</p>
          </div>

        </aside>
        {children}
      </main>
    </>
  );
}
