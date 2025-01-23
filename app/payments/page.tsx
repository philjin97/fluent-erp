import PaymentTable from "../components/payment-table"
import { getStudents } from "@/lib/data"

export default async function Payments() {
  const students = await getStudents()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Payments</h1>
      <PaymentTable initialStudents={students} />
    </div>
  )
}