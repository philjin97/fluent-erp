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
            <th className="w-1/6 px-4 py-2 border-b">Teacher Name</th>
            <th className="w-1/4 px-4 py-2 border-b">Phone Number</th>
            <th className="px-4 py-2 border-b">Experience</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher._id}>
              <td className="px-4 py-2 border-b text-center">
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="text-blue-600 hover:underline focus:outline-none"
                >
                  {teacher.name}
                </button>
              </td>
              <td className="px-4 py-2 border-b text-center">{teacher.phoneNumber}</td>
              <td className="px-4 py-2 border-b text-center">{teacher.experience}</td>
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

