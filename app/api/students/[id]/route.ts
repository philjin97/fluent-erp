import { NextResponse } from "next/server"
import { updateStudent } from "@/lib/api"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const updatedStudent = await updateStudent(id, body)
    return NextResponse.json(updatedStudent)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 })
  }
}

