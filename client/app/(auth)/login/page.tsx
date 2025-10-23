import Link from "next/link"
import "./login.css"

function Login() {
  return (
    <div className="login-page">
        <form>
            <div>
                <label className="auth-label" htmlFor="email">
                    EMAIL ADDRESS
                </label>

                <input 
                required
                id="email"
                className="auth-input" type="email" />
            </div>

            <div>
                <label 
                className="auth-label" htmlFor="password">PASSWORD</label>

                <input 
                required
                className="auth-input"
                type="password" name="password" id="password" />
            </div>

            <button className="primary-button">
                Login
            </button>

            <p className="auth-tip">Don&apos;t have an account? <Link href="/signup">Signup</Link></p>
        </form>
    </div>
  )
}

export default Login