import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
const uri = process.env.MONGODB_URI
if (!uri) {
    throw new Error("MONGODB_URI is not defined in the .env file");
  }
const client = new MongoClient(uri)

export type Student = {
    _id: string;
    name: string;
    signedUp: boolean;
    status: "didn't decide yet" | "paid but teacher not assigned" | "finalized" | "lost cause";
    teacherName: string;
    level: number;
    createdAt: string;
    notes: string;
};
  
export async function getStudents(): Promise<Student[]> {
    try {
      await client.connect();
      const database = client.db("school_management");
      const students = database.collection("students");
  
      const result = await students.find({}).toArray();
  
      // Explicitly map the result to the Student type
      const studentList: Student[] = result.map((doc) => ({
        _id: doc._id.toString(), // Convert MongoDB ObjectId to string
        name: doc.name ?? "", // Default to empty string if field is missing
        signedUp: doc.signedUp ?? false, // Default to false if field is missing
        status: doc.status ?? "didn't decide yet", // Default to the first status
        teacherName: doc.teacherName ?? "", // Default to empty string
        level: doc.level ?? 0, // Default to 0
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(), // Convert or default to now
        notes: doc.notes ?? "", // Default to empty string
      }));
  
      return studentList;
    } finally {
      await client.close();
    }
}

export async function updateStudent(id: string, update: Partial<Student>): Promise<Student> {
    try {
      await client.connect();
      const database = client.db("school_management");
      const students = database.collection("students");
  
      // Update the student and return the updated document
      const result = await students.findOneAndUpdate(
        { _id: new ObjectId(id) }, // Convert string id to ObjectId
        { $set: update },
        { returnDocument: "after" } // Return the updated document
      );
  
      if (result == null) {
        throw new Error(`Student with id ${id} not found`);
      }
  
      // Convert the _id to string if necessary and return the updated student
      return {
        _id: result.value._id.toString(), // Ensure _id is converted to string
        name: result.value.name,
        signedUp: result.value.signedUp,
        status: result.value.status,
        teacherName: result.value.teacherName,
        level: result.value.level,
        createdAt: result.value.createdAt,
        notes: result.value.notes,
      };
    } finally {
      await client.close();
    }
  }

// Client-side API calls
export async function fetchStudents(): Promise<Student[]> {
  const response = await fetch("/api/students")
  if (!response.ok) {
    throw new Error("Failed to fetch students")
  }
  return response.json()
}

export async function updateStudentClient(id: string, update: Partial<Student>): Promise<Student> {
  const response = await fetch(`/api/students/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(update),
  })
  if (!response.ok) {
    throw new Error("Failed to update student")
  }
  return response.json()
}

