"use client"
import "./Sidebar.css"
import OverviewIcon from "@/components/dashboard/OverviewIcon/OverviewIcon";
import GoalsIcon from "@/components/dashboard/GoalsIcon/GoalsIcon";
import EntriesIcon from "@/components/dashboard/EntriesIcon/EntriesIcon";
import SingleNavLink from "@/components/dashboard/SingleNavLink/SingleNavLink";
import { usePathname } from "next/navigation";
import AddIcon from "@/components/dashboard/AddIcon/AddIcon";
import plusIcon from "@/public/images/add-icon.svg"
import Image from "next/image";
import placeholderImage from "@/public/images/placeholder-image.png"
import { useAtomValue, useSetAtom } from "jotai";
import { showAddTransactionModalAtom, userInfoAtom } from "@/states/dashboard.states";



function Sidebar() {
  const userInfo = useAtomValue(userInfoAtom)
  const setShowAddTransactionModal = useSetAtom(showAddTransactionModalAtom)

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
   <aside className="dashboard-sidebar">

          <div className="main-button">

          <button 
          onClick={()=>setShowAddTransactionModal(true)}
          className="primary-button">
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
              src={userInfo?.user.image || placeholderImage}
              width={40}
              height={40}
              alt="profile picture"
              className="profile-picture"
              />   
            </nav>
          </div>

          <div className="profile-section">
            <Image 
            width={20}
            height={20}
            alt="Your profile picture"
            className="profile-picture"
            src={userInfo?.user.image || placeholderImage}
            />

            <p>Logout</p>
          </div>

        </aside>
  )
}

export default Sidebar