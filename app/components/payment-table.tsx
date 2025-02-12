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
            <th className="w-1/6 px-4 py-2 border-b">Student Name</th>
            <th className="w-1/16 px-4 py-2 border-b">Credits</th>
            <th className="w-3/4 px-4 py-2 border-b">Payment History</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td className="px-4 py-2 border-b text-center">{student.name}</td>
              <td className="px-4 py-2 border-b text-center">
                <Input
                  type="number"
                  defaultValue={student.credits ?? 0} // Changed to defaultValue
                  onBlur={(e) => handleUpdate(student._id ?? "", "credits", Number(e.target.value))}
                  className="w-full mx-auto"
                />
              </td>
              <td className="px-4 py-2 border-b">
                <textarea
                  defaultValue={student.paymentHistory ?? ""} // Changed to defaultValue
                  onBlur={(e) => handleUpdate(student._id ?? "", "paymentHistory", e.target.value)}
                  className="w-full min-h-[40px] p-2 border rounded-md resize-y"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
