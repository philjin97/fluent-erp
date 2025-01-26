"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addStudent } from "@/lib/actions"

export default function RegisterStudentModal() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget);

    try {
      await addStudent(formData)
      setOpen(false)
      router.push("/")
    } catch (error) {
      if (error instanceof Error) {
        // Now TypeScript knows that `error` is of type `Error`, so `message` is safe to access.
        setError(error.message);
      } else {
        // If the error is not an instance of Error, handle it accordingly
        setError("An unknown error occurred.");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Register Student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px] sm:max-h-[650px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Student</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <h2 className="text-xl font-semibold">Basic Info</h2>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input id="age" name="age" type="number" required />
          </div>
          <div>
            <Label htmlFor="job">Job</Label>
            <Input id="job" name="job" required />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" name="phoneNumber" type="tel" required />
          </div>
          <div>
            <Label htmlFor="selfPerceivedLevel">Self-perceived Level (1-10)</Label>
            <Input id="selfPerceivedLevel" name="selfPerceivedLevel" type="number" min="1" max="10"/>
          </div>
          <div>
            <Label htmlFor="englishGoal">Personal-English Goal (1-10)</Label>
            <Input id="englishGoal" name="englishGoal" type="number" min="1" max="10"/>
          </div>
          <div>
            <Label htmlFor="reasonForStudying">Reason for studying this time</Label>
            <Input id="reasonForStudying" name="reasonForStudying" />
          </div>
          <div>
            <Label htmlFor="englishBackground">English Background</Label>
            <Input id="englishBackground" name="englishBackground" />
          </div>
          <div>
            <Label htmlFor="expectedDuration">Expected duration to achieve goal</Label>
            <Input id="expectedDuration" name="expectedDuration" />
          </div>
          <div>
            <Label htmlFor="homeworkHours">How many hours can you invest in homework between classes?</Label>
            <Input id="homeworkHours" name="homeworkHours" />
          </div>

          {/* Level Test */}
          <h2 className="text-xl font-semibold">Level Test</h2>
          <div>
            <Label htmlFor="consentForRecording">Consent for recording</Label>
            <Select name="consentForRecording">
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
            <Label htmlFor="commonQuestion1">Common Questions - Hi nice to meet you, my name is David. What is your name?</Label>
            <Input id="commonQuestion1" name="commonQuestion1" />
          </div>
          <div>
            <Label htmlFor="commonQuestion2">Common Questions - Can you introduce yourself?</Label>
            <Input id="commonQuestion2" name="commonQuestion2" />
          </div>

          {/* Translations */}
          <h2 className="text-xl font-semibold">Translations</h2>
          {[
            "오늘 뭐했니?",
            "내일 뭐할거니?",
            "뭐 먹었니?",
            "너는 선생님이니?",
            "너 어디에 사니?",
            "너 홍대에 사니?",
            "집이 어디니?",
            "나 햄버거 먹고 싶어",
            "나는 일찍 자야 해",
            "너 뭐 사고 싶어?",
            "홍대에 사람이 많아",
            "나는 친구를 만나기 위해 홍대에 갔어",
            "나는 요즘 여행하는 중이야",
            "운동하는 것은 재미있어",
            "나는 아침을 먹는 동안 티비를 봤어",
            "나는 휴가 동안 집에 있었어",
            "오늘 그거 말고 또 다른거 했어?",
            "주말에 재미있는거 했어?",
            "얼마나 오래 영어를 가르쳤니?",
            "어떤 영화 봤어?",
          ].map((question, index) => (
            <div key={index}>
              <Label htmlFor={`translation${index + 1}`}>
                {index + 1}. {question}
              </Label>
              <Input id={`translation${index + 1}`} name={`translation${index + 1}`} />
            </div>
          ))}

          {/* Level Test Evaluation */}
          <h2 className="text-xl font-semibold">Level Test Evaluation</h2>
          <div>
            <Label htmlFor="level">Overall Level (1-10)</Label>
            <Input id="level" name="level" type="number" min="1" max="10" />
          </div>
          <div>
            <Label htmlFor="levelDescription">Description</Label>
            <Input id="levelDescription" name="levelDescription" />
          </div>

          {/* Curriculum Guide */}
          <h2 className="text-xl font-semibold">Curriculum Guide</h2>
          <div>
            <Label htmlFor="curriculum">Curriculum</Label>
            <Input id="curriculum" name="curriculum" />
          </div>

          {/* Class Schedule */}
          <h2 className="text-xl font-semibold">Class Schedule</h2>
          <div>
            <Label htmlFor="classSchedule">Class Schedule</Label>
            <Input id="classSchedule" name="classSchedule" />
          </div>

          {/* Finalized Schedule */}
          <h2 className="text-xl font-semibold">Finalized Schedule</h2>
          <div>
            <Label htmlFor="finalizedNotes">Notes</Label>
            <Input id="finalizedNotes" name="finalizedNotes" defaultValue="" />
          </div>

          <div>
            <Label htmlFor="credits">Credits</Label>
            <Input id="credits" name="credits" type="number" defaultValue={0} />
          </div>
          <div>
            <Label htmlFor="paymentHistory">Payment History</Label>
            <Input id="paymentHistory" name="paymentHistory" defaultValue="" />
          </div>

          {/* Additional Information */}
          <h2 className="text-xl font-semibold">Additional Information</h2>
          <div>
            <Label htmlFor="signedUp">Signed Up</Label>
            <Select name="signedUp" defaultValue="Yes">
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
            <Select name="status">
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
            <Input id="teacher" name="teacher" defaultValue="" />
          </div>
          <div>
            <Label htmlFor="paymentNotes">Payment Notes</Label>
            <Input id="paymentNotes" name="paymentNotes" defaultValue="" />
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

