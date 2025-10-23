"use client"
import Image from 'next/image';
import "./auth.global.css"
import logo from "@/public/images/logo.svg"
import { usePathname } from 'next/navigation';


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authHeadings = [
    {
      match : "/login",
      toRender : `Welcome Back. <br />
       Login to continue using Zeni`
    },
    {
      match : "/signup",
      toRender : `Welcome Aboard. <br />
Create an account to start using Zeni`
    },
    {
      match : "/currency",
      toRender : `Select your currency`
    },
    {
      match : "/signup/info",
      toRender : `You're almost there`
    }
  ]

  const currentPathName = usePathname()
  const textToRender = authHeadings.find((obj)=> obj.match == currentPathName)?.toRender as (string | TrustedHTML)

  return (
      <main className='auth-main'>
        <header>
            <Image
            src={logo}
            alt={"logo"}
            />

            <h1 dangerouslySetInnerHTML={{__html : textToRender}} className="auth-heading">
               
            </h1>
        </header>
        {children}
      </main>
  );
}

