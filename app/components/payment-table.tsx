"use client"

import { useState } from "react"
import type { Student } from "@/lib/definitions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { updateStudent } from "@/lib/actions"

export default function PaymentTable({ initialStudents }: { initialStudents: Student[] }) {
  const [students, setStudents] = useState(initialStudents)

  const handleUpdate = async (id: string, field: "credits" | "paymentHistory", value: string | number) => {
    try {
      const updatedStudent = await updateStudent(id, { [field]: value })
      setStudents(students.map((s) => (s._id === id ? updatedStudent : s)))
    } catch (error) {
      console.error("Failed to update student:", error)
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b">Student Name</th>
            <th className="px-4 py-2 border-b">Credits</th>
            <th className="px-4 py-2 border-b">Payment History</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td className="px-4 py-2 border-b">{student.name}</td>
              <td className="px-4 py-2 border-b">
                <Input
                  type="number"
                  value={student.credits ?? 0}
                  onChange={(e) => handleUpdate(student._id ?? "", "credits", Number(e.target.value))}
                  className="w-full"
                />
              </td>
              <td className="px-4 py-2 border-b">
                <Input
                  value={student.paymentHistory ?? 0}
                  onChange={(e) => handleUpdate(student._id ?? "", "paymentHistory", e.target.value)}
                  className="w-full"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
