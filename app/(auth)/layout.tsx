import Image from 'next/image';
import "./auth.global.css"
import logo from "@/public/images/logo.svg"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <main className='auth-main'>
        <header>
            <Image
            src={logo}
            alt={"logo"}
            />

            <h1 className="auth-heading">
                Welcome Aboard.
                <br />
                Create an account to start using Zeni
            </h1>
        </header>
        {children}
      </main>
  );
}

