import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const isLoggedIn = false

  if(!isLoggedIn){
    redirect("/signup")
  }
  return (
      <main>
        {children}
      </main>
  );
}
