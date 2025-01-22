import "./globals.css"
import { Inter } from "next/font/google"
import NavBar from "./components/nav-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "School Management System",
  description: "A clean, black and white school management system",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black`}>
        <div className="flex h-screen">
          <NavBar />
          <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}

