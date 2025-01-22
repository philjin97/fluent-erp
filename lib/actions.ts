"use server"

import { revalidatePath } from "next/cache"
import { addStudent as addStudentToDB, updateStudent as updateStudentInDB } from "./data"
import { addTeacher as addTeacherToDB, updateTeacher as updateTeacherInDB } from "./data"
import type { Student } from "./definitions"
import type { Teacher } from "./definitions"
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export async function updateStudent(id: string, update: Partial<Student>): Promise<Student> {
  try {
    console.log(id, update)
    const updatedStudent = await updateStudentInDB(id, update)
    console.log(updatedStudent)
    revalidatePath("/student-registration")
    return updatedStudent
  } catch (error) {
    console.error("Failed to update student:", error)
    throw new Error("Failed to update student. Please try again.")
  }
}

const koreanDate = toZonedTime(new Date(), "Asia/Seoul");

export async function addStudent(formData: FormData): Promise<Student> {
  try {
    const newStudent = {
        name: formData.get("name") as string,
        age: Number(formData.get("age")),
        job: formData.get("job") as string,
        phoneNumber: formData.get("phoneNumber") as string,
        selfPerceivedLevel: Number(formData.get("selfPerceivedLevel")),
        englishGoal: Number(formData.get("englishGoal")),
        reasonForStudying: formData.get("reasonForStudying") as string,
        englishBackground: formData.get("englishBackground") as string,
        expectedDuration: formData.get("expectedDuration") as string,
        homeworkHours: formData.get("homeworkHours") as string,
        consentForRecording: formData.get("consentForRecording") as "Yes" | "No",
        commonQuestion1: formData.get("commonQuestion1") as string,
        commonQuestion2: formData.get("commonQuestion2") as string,
        level: Number(formData.get("level")),
        levelDescription: formData.get("levelDescription") as string,
        curriculum: formData.get("curriculum") as string,
        classSchedule: formData.get("classSchedule") as string,
        finalizedNotes: formData.get("finalizedNotes") as string,
        signedUp: formData.get("signedUp") === "Yes",
        status: formData.get("status") as Student["status"],
        teacher: formData.get("teacher") as string,
        paymentNotes: formData.get("paymentNotes") as string,
        createdAt: format(koreanDate, "yyyy-MM-dd"),
    }
    const addedStudent = await addStudentToDB(newStudent)
    revalidatePath("/student-registration")
    return addedStudent
  } catch (error) {
    console.error("Failed to add student:", error)
    throw new Error("Failed to add student. Please try again.")
  }
}


export async function addTeacher(formData: FormData): Promise<Teacher> {
    try {
      const newTeacher = {
        name: formData.get("name") as string,
        experience: Number(formData.get("experience")),
        notes: formData.get("notes") as string,
        createdAt: new Date().toISOString(),
      }
      const addedTeacher = await addTeacherToDB(newTeacher)
      revalidatePath("/teacher-information")
      return addedTeacher
    } catch (error) {
      console.error("Failed to add teacher:", error)
      throw new Error("Failed to add teacher. Please try again.")
    }
  }
  
  export async function updateTeacher(id: string, update: Partial<Teacher>): Promise<Teacher> {
    try {
      const updatedTeacher = await updateTeacherInDB(id, update)
      revalidatePath("/teacher-information")
      return updatedTeacher
    } catch (error) {
      console.error("Failed to update teacher:", error)
      throw new Error("Failed to update teacher. Please try again.")
    }
  }