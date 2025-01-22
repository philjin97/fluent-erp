"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { name: "Student Registration", href: "/student-registration" },
  { name: "Payments", href: "/payments" },
  { name: "Teacher Information", href: "/teacher-information" },
  { name: "Class Archives", href: "/class-archives" },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-8">David's English Management System</h1>
      <ul>
        {navItems.map((item) => (
          <li key={item.name} className="mb-4">
            <Link
              href={item.href}
              className={`block p-2 rounded transition-colors ${
                pathname === item.href ? "bg-white text-black" : "hover:bg-gray-800"
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

