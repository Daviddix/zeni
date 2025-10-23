import "./SingleCurrency.css"

 type currencyType = {
    name: string,
    symbol: string
  }

type singleCurrencyProps = {
    symbol: string;
    name: string;
    setSelectedCurrency: (currency: currencyType) => void;
    selectedCurrency : currencyType | null;
}

function SingleCurrency({ symbol, name, setSelectedCurrency, selectedCurrency }: singleCurrencyProps) {
  return (
   <button className={selectedCurrency?.name === name ? "single-currency active" : "single-currency"}
   onClick={() => setSelectedCurrency({ name, symbol })}>
          <h1>{symbol}</h1>
          <p>{name}</p>
        </button>
  )
}

export default SingleCurrency