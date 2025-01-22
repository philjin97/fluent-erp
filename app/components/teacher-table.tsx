"use client"

import { useState } from "react"
import type { Teacher } from "@/lib/definitions"
import EditTeacherModal from "@/app/components/edit-teacher-modal"

export default function TeacherTable({ initialTeachers }: { initialTeachers: Teacher[] }) {
  const [teachers, setTeachers] = useState(initialTeachers)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border-b">Teacher Name</th>
            <th className="px-4 py-2 border-b">Experience</th>
            <th className="px-4 py-2 border-b">Notes</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher._id}>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  {teacher.name}
                </button>
              </td>
              <td className="px-4 py-2 border-b">{teacher.experience}</td>
              <td className="px-4 py-2 border-b">{teacher.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedTeacher && (
        <EditTeacherModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          onUpdate={(updatedTeacher) => {
            setTeachers(teachers.map((t) => (t._id === updatedTeacher._id ? updatedTeacher : t)))
            setSelectedTeacher(null)
          }}
        />
      )}
    </div>
  )
}

