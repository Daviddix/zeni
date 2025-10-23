import "./currency.css"

function Currency() {
  return (
    <div className="currencies-page">

      <div className="currency-container">
        <button className="single-currency">
          <h1>$</h1>
          <p>US DOLLAR</p>
        </button>

        <button className="single-currency">
          <h1>₦</h1>
          <p>NAIRA</p>
        </button>

        <button className="single-currency">
          <h1>¥</h1>
          <p>JAPANESE YEN</p>
        </button>

        <button className="single-currency">
          <h1>€</h1>
          <p>EURO</p>
        </button>
      </div>

      <button className="primary-button">
        Get Started
      </button>
    </div>
  )
}

export default Currency