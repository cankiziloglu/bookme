import { ReactNode } from "react"


const AuthLayout = ({ children }: {children: ReactNode }) => {
  
  return (
    <main className="min-h-screen flex flex-col justify-center items-center">
      {children}
    </main>
  )
}

export default AuthLayout