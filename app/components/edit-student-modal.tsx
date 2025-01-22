"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateStudent } from "@/lib/actions"
import type { Student } from "@/lib/definitions"

interface EditStudentModalProps {
  student: Student
  onClose: () => void
  onUpdate: (updatedStudent: Student) => void
}

export default function EditStudentModal({ student, onClose, onUpdate }: EditStudentModalProps) {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)

    const formDataWithEmptyStrings = new FormData()
    formData.forEach((value, key) => {
      // Append empty strings for null or undefined values
      formDataWithEmptyStrings.append(key, value ? value.toString() : "")
    })

    try {
      const updatedStudent = await updateStudent(student._id, Object.fromEntries(formDataWithEmptyStrings))
      onUpdate(updatedStudent)
      onClose()
      router.push("/")
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] sm:max-h-[650px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student: {student.name}</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <h2 className="text-xl font-semibold">Basic Info</h2>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={student.name} required />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" name="age" type="number" defaultValue={student.age} required />
          </div>
          <div>
            <Label htmlFor="job">Job</Label>
            <Input id="job" name="job" defaultValue={student.job} required />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" name="phoneNumber" type="tel" defaultValue={student.phoneNumber} required />
          </div>
          <div>
            <Label htmlFor="selfPerceivedLevel">Self-perceived Level (1-10)</Label>
            <Input
              id="selfPerceivedLevel"
              name="selfPerceivedLevel"
              type="number"
              min="1"
              max="10"
              defaultValue={student.selfPerceivedLevel}
            />
          </div>
          <div>
            <Label htmlFor="englishGoal">Personal-English Goal (1-10)</Label>
            <Input
              id="englishGoal"
              name="englishGoal"
              type="number"
              min="1"
              max="10"
              defaultValue={student.englishGoal}
            />
          </div>
          <div>
            <Label htmlFor="reasonForStudying">Reason for studying this time</Label>
            <Input id="reasonForStudying" name="reasonForStudying" defaultValue={student.reasonForStudying} />
          </div>
          <div>
            <Label htmlFor="englishBackground">English Background</Label>
            <Input id="englishBackground" name="englishBackground" defaultValue={student.englishBackground} />
          </div>
          <div>
            <Label htmlFor="expectedDuration">Expected duration to achieve goal</Label>
            <Input id="expectedDuration" name="expectedDuration" defaultValue={student.expectedDuration} />
          </div>
          <div>
            <Label htmlFor="homeworkHours">How many hours can you invest in homework between classes?</Label>
            <Input id="homeworkHours" name="homeworkHours" defaultValue={student.homeworkHours} />
          </div>

          {/* Level Test */}
          <h2 className="text-xl font-semibold">Level Test</h2>
          <div>
            <Label htmlFor="consentForRecording">Consent for recording</Label>
            <Select name="consentForRecording" defaultValue={student.consentForRecording}>
              <SelectTrigger>
                <SelectValue placeholder="Select consent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="commonQuestion1">
              Common Questions - Hi nice to meet you, my name is David. What is your name?
            </Label>
            <Input id="commonQuestion1" name="commonQuestion1" defaultValue={student.commonQuestion1} />
          </div>
          <div>
            <Label htmlFor="commonQuestion2">Common Questions - Can you introduce yourself?</Label>
            <Input id="commonQuestion2" name="commonQuestion2" defaultValue={student.commonQuestion2} />
          </div>

          {/* Level Test Evaluation */}
          <h2 className="text-xl font-semibold">Level Test Evaluation</h2>
          <div>
            <Label htmlFor="level">Overall Level (1-10)</Label>
            <Input id="level" name="level" type="number" min="1" max="10" defaultValue={student.level} />
          </div>
          <div>
            <Label htmlFor="levelDescription">Description</Label>
            <Input id="levelDescription" name="levelDescription" defaultValue={student.levelDescription} />
          </div>

          {/* Curriculum Guide */}
          <h2 className="text-xl font-semibold">Curriculum Guide</h2>
          <div>
            <Label htmlFor="curriculum">Curriculum</Label>
            <Input id="curriculum" name="curriculum" defaultValue={student.curriculum} />
          </div>

          {/* Class Schedule */}
          <h2 className="text-xl font-semibold">Class Schedule</h2>
          <div>
            <Label htmlFor="classSchedule">Class Schedule</Label>
            <Input id="classSchedule" name="classSchedule" defaultValue={student.classSchedule} />
          </div>

          {/* Finalized Schedule */}
          <h2 className="text-xl font-semibold">Finalized Schedule</h2>
          <div>
            <Label htmlFor="finalizedNotes">Notes</Label>
            <Input id="finalizedNotes" name="finalizedNotes" defaultValue={student.finalizedNotes} />
          </div>

          {/* Additional Information */}
          <h2 className="text-xl font-semibold">Additional Information</h2>
          <div>
            <Label htmlFor="signedUp">Signed Up</Label>
            <Select name="signedUp" defaultValue={student.signedUp ? "Yes" : "No"}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={student.status}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lost cause">Lost cause</SelectItem>
                <SelectItem value="didn't decide yet">Didn't decide yet</SelectItem>
                <SelectItem value="paid but teacher not assigned">Paid but teacher not assigned</SelectItem>
                <SelectItem value="finalized">Finalized</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="teacher">Teacher</Label>
            <Input id="teacher" name="teacher" defaultValue={student.teacher} />
          </div>
          <div>
            <Label htmlFor="paymentNotes">Payment Notes</Label>
            <Input id="paymentNotes" name="paymentNotes" defaultValue={student.paymentNotes} />
          </div>

          <Button type="submit">Update Student</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

