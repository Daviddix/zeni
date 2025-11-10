"use client"

import Image from 'next/image'
import Link from 'next/link'
import logo from "@/public/images/landing-page-logo.svg"
import demoImage from "@/public/images/deom.png"
import "./page.css"

function page() {
  return (
    <main className="landing-page-main">

      <div className="landing-page-header">

      <nav>
        <Image src={logo} alt='logo' />
      </nav>

        <h1>A New Way to Track Your Expenses</h1>

        <p>Track your expenses, create budget goals, get insights about your transaction and more using your natural language</p>

        <Link href={"/signup"}>
        <button>Get Started</button>
        </Link>

        <Image 
        className='demo-img'
        src={demoImage} alt='demo image'  />
      </div>
    </main>
  )
}

export default page