import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import type { Student, Teacher } from "./definitions"

export async function getStudents(): Promise<Student[]> {
  const client = await clientPromise
  const database = client.db("school_management")
  const students = database.collection("students")
  const result = await students.find({}).sort({ createdAt: -1 }).toArray()
  return result.map((doc) => ({
    ...doc,
    _id: doc._id.toString(),
    credits: doc.credits || 0,
    paymentHistory: doc.paymentHistory || "",
  })) as Student[]
}

export async function updateStudent(id: string, update: Partial<Student>): Promise<Student> {
  const client = await clientPromise
  console.log("client ok")
  const database = client.db("school_management")
  const students = database.collection("students")
  const result = await students.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: update },
    { returnDocument: "after" },
  )
  

  if (result == null) {
    throw new Error(`Student with ID ${id} not found or not updated.`);
  }

  return { ...result, _id: result._id.toString() } as Student
}

export async function addStudent(student: Omit<Student, "_id">): Promise<Student> {
  const client = await clientPromise
  const database = client.db("school_management")
  const students = database.collection("students")
  const result = await students.insertOne(student)
  return { ...student, _id: result.insertedId.toString() } as Student
}

export async function getTeachers(): Promise<Teacher[]> {
    const client = await clientPromise
    const database = client.db("school_management")
    const teachers = database.collection("teachers")
    const result = await teachers.find({}).toArray()
    return result.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    })) as Teacher[]
  }
  
  export async function addTeacher(teacher: Omit<Teacher, "_id">): Promise<Teacher> {
    const client = await clientPromise
    const database = client.db("school_management")
    const teachers = database.collection("teachers")
    const result = await teachers.insertOne(teacher)
    return { ...teacher, _id: result.insertedId.toString() } as Teacher
  }
  
  export async function updateTeacher(id: string, update: Partial<Teacher>): Promise<Teacher> {
    const client = await clientPromise
    const database = client.db("school_management")
    const teachers = database.collection("teachers")
    const result = await teachers.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: "after" },
    )
    return { ...result, _id: result._id.toString() } as Teacher
  }