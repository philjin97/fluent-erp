import StudentTable from "../components/student-table"
import RegisterStudentModal from "@/app/components/register-student-modal"
import { getStudents } from "@/lib/data"

export default async function StudentRegistration() {
  const students = await getStudents()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Registration</h1>
        <RegisterStudentModal />
      </div>
      <StudentTable initialStudents={students} />
    </div>
  )
}




