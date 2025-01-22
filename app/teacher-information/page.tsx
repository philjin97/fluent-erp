import TeacherTable from "@/app/components/teacher-table"
import RegisterTeacherModal from "@/app/components/register-teacher-modal"
import { getTeachers } from "@/lib/data"

export default async function TeacherInformation() {
  const teachers = await getTeachers()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teacher Information</h1>
        <RegisterTeacherModal />
      </div>
      <TeacherTable initialTeachers={teachers} />
    </div>
  )
}

