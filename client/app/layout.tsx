import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zeni | Next Level Budgeting( Google Cloud Run Hackathon - AI Agent Category )",
  description: "AI-powered budgeting assistant to help you manage your expenses effectively.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={
        {
          backgroundColor : "#fafafa"
        }
      } >
        {children}
      </body>
    </html>
  );
}
