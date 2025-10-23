import Link from "next/link";

function Signup() {
  return (
    <div className="signup-page">
      <form>
        <div>
          <label className="auth-label" htmlFor="email">
            EMAIL ADDRESS
          </label>

          <input type="email" id="email" required className="auth-input" />
        </div>

        <div>
          <label className="auth-label" htmlFor="password">
            PASSWORD
          </label>

          <input
            className="auth-input"
            type="password"
            name="password"
            id="password"
          />
        </div>

        <button className="primary-button">Create Account</button>

        <p className="auth-tip">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
