import "./LoadingSpinner.css"

type LoadingSpinnerProps = {
  text?: string;
}

function LoadingSpinner({ text = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
      <p className="loading-text-animated">{text}</p>
    </div>
  )
}

export default LoadingSpinner
