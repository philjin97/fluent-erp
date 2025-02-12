"use client"

import { useState } from "react"
import { updateStudent } from "@/lib/actions"
import { Student } from "@/lib/definitions"
import EditStudentModal from "./edit-student-modal"


export default function StudentTable({ initialStudents }: { initialStudents: Student[] }) {
  const [students, setStudents] = useState(initialStudents)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  const handleChange = async (id: string, field: keyof Student, value: any) => {
    console.log(id, field, value)
    const updatedStudent = await updateStudent(id, { [field]: value })
    console.log(updatedStudent)
    // setStudents(students.map((student) => (student._id === id ? updatedStudent : student)))
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b">Student Name</th>
            <th className="px-4 py-2 border-b">Signed Up</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Teacher Name</th>
            <th className="px-4 py-2 border-b">Level</th>
            <th className="px-4 py-2 border-b">Registered Date</th>
            <th className="px-4 py-2 border-b">Notes</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  {student.name}
                </button>
              </td>
              <td className="px-4 py-2 border-b">
                <input
                    type="checkbox"
                    defaultChecked={student.signedUp}
                    onChange={(e) => handleChange(student._id ?? "", "signedUp", e.target.checked)}
                    className="form-checkbox h-5 w-5 text-black"
                  />
              </td>
              <td className="px-4 py-2 border-b">
                <select
                    defaultValue={student.status}
                    onBlur={(e) => handleChange(student._id ?? "", "status", e.target.value)}
                    className="w-full p-1 border rounded"
                  >
                    <option value="didn't decide yet">Didn't decide yet</option>
                    <option value="paid but teacher not assigned">Paid but teacher not assigned</option>
                    <option value="finalized">Finalized</option>
                    <option value="lost cause">Lost cause</option>
                  </select>
              </td>
              <td className="px-4 py-2 border-b">
                <input
                    type="text"
                    defaultValue={student.teacher}
                    onBlur={(e) => handleChange(student._id ?? "", "teacher", e.target.value)}
                    className="w-full p-1 border rounded"
                  />
              </td>
              <td className="px-4 py-2 border-b">
                <input
                    type="number"
                    min="1"
                    max="10"
                    defaultValue={student.level}
                    onBlur={(e) => handleChange(student._id ?? "", "level", Number.parseInt(e.target.value, 10))}
                    className="w-full p-1 border rounded"
                  />
              </td>
              <td className="px-4 py-2 border-b">{student.createdAt}</td>
              <td className="px-4 py-2 border-b">
                <textarea
                    defaultValue={student.paymentNotes}
                    onBlur={(e) => handleChange(student._id ?? "", "paymentNotes", e.target.value)}
                    className="w-full p-1 border rounded"
                  />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onUpdate={(updatedStudent) => {
            setStudents(students.map((s) => (s._id === updatedStudent._id ? updatedStudent : s)))
            setSelectedStudent(null)
          }}
        />
      )}
    </div>
  )
}

