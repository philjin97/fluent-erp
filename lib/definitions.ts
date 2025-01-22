export type Student = {
  _id?: string
  name: string
  age: number
  job: string
  phoneNumber: string
  selfPerceivedLevel: number
  englishGoal: number
  reasonForStudying: string
  englishBackground: string
  expectedDuration: string
  homeworkHours: string
  consentForRecording: "Yes" | "No"
  commonQuestion1: string
  commonQuestion2: string
  level: number
  levelDescription: string
  curriculum: string
  classSchedule: string
  finalizedNotes: string
  signedUp: boolean
  status: "lost cause" | "didn't decide yet" | "paid but teacher not assigned" | "finalized"
  teacher: string
  paymentNotes: string
  createdAt: string
}

export type Teacher = {
  _id?: string
  name: string
  experience: number
  notes: string
  createdAt: string
}