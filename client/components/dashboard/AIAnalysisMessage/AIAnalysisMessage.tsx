import Image from "next/image";
import "./AIAnalysisMessage.css"
import zeniAIIcon from "@/public/images/zeni-ai-icon.svg"
import Markdown from "react-markdown";

type aiAnalysisMessageProps = {
    messageToDisplay: string;
    status: "sending" | "completed" | "error";
}

function AIAnalysisMessage({ messageToDisplay, status }: aiAnalysisMessageProps) {
    return (
        <div className="ai-analysis-message">
            <Image 
                width={30}
                height={30}
                src={zeniAIIcon}
                alt="Zeni AI"
            />

            {status === "sending" && (
                <p className="ai-analysis-message-text">Analyzing your transactions...</p>
            )}

            {status === "error" && (
                <p className="error-text">{messageToDisplay || "An error occurred"}</p>
            )}

            {status === "completed" && (
                <p className="ai-analysis-message-text">
                    <Markdown>
                    {messageToDisplay}
                    </Markdown>
                </p>
            )}
        </div>
    )
}

export default AIAnalysisMessage
