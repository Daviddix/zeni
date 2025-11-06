"use client"

import Image from 'next/image'
import Link from 'next/link'
import logo from "@/public/images/logo.svg"
import "./page.css"

function page() {
  return (
    <main className="landing-page-main">
      <nav className="landing-nav">
        <Image src={logo} alt="Zeni logo" width={40} height={40} />
        <div className="nav-links">
          <Link href="/login" className="login-link">Login</Link>
          <Link href="/signup" className="primary-button signup-btn">Sign Up</Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-badge">💰 Zeni AI: Your Proactive Financial Copilot</div>
        <h1>Intelligent Tracking, Effortless Goals.</h1>
        <p className="hero-description">
          Welcome to Zeni AI, the only financial tool powered by an advanced multi-agent system 
          designed to turn your spending habits into actionable savings. Stop logging data into 
          static spreadsheets; start engaging with an AI that actively monitors your goals and 
          advises you on every transaction.
        </p>
        <Link href="/signup" className="primary-button cta-button">
          Get Started Free
        </Link>
      </section>

      <section className="difference-section">
        <h2>The Zeni Difference: Beyond Basic Budgeting</h2>
        <p className="section-subtitle">
          Zeni is more than just an expense tracker—it&apos;s a dedicated team of AI financial 
          specialists working 24/7. Our unique multi-agent architecture allows Zeni to handle 
          complex tasks with ease:
        </p>

        <div className="agents-grid">
          <div className="agent-card">
            <div className="agent-icon">📝</div>
            <h3>Expense Logger</h3>
            <p className="agent-subtitle">Data Structuring Agent</p>
            <p className="agent-description">
              Simply tell Zeni what you spent. It uses multimodal analysis (text or receipts) 
              to instantly categorize and log the transaction, ensuring clean, accurate data 
              from day one.
            </p>
          </div>

          <div className="agent-card">
            <div className="agent-icon">🎯</div>
            <h3>Goal Tracker</h3>
            <p className="agent-subtitle">Budget Goal Agent</p>
            <p className="agent-description">
              Set spending caps or savings targets and let Zeni manage the rest. Every 
              transaction is checked against your goals in real-time, instantly updating 
              your progress.
            </p>
          </div>

          <div className="agent-card">
            <div className="agent-icon">📊</div>
            <h3>Senior Analyst</h3>
            <p className="agent-subtitle">Data Processor Agent</p>
            <p className="agent-description">
              Get deep, professional insights into your overall spending trends, spotting 
              anomalies and suggesting areas for significant savings every month.
            </p>
          </div>

          <div className="agent-card">
            <div className="agent-icon">💡</div>
            <h3>Spending Coach</h3>
            <p className="agent-subtitle">Category Spending Advisor</p>
            <p className="agent-description">
              Ask questions like &quot;Am I overspending on food?&quot; and get a personalized, 
              supportive verdict on your habits, backed by specific, practical advice.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Take Control of Your Financial Future</h2>
        <p>
          Start logging your first expense or setting your first goal today and take control 
          of your financial future.
        </p>
        <Link href="/signup" className="primary-button cta-button-secondary">
          Start Your Journey
        </Link>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Image src={logo} alt="Zeni logo" width={30} height={30} />
            <p>Zeni AI © 2025</p>
          </div>
          <p className="footer-tagline">Your Proactive Financial Copilot</p>
        </div>
      </footer>
    </main>
  )
}

export default page