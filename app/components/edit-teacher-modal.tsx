"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateTeacher } from "@/lib/actions"
import type { Teacher } from "@/lib/definitions"

interface EditTeacherModalProps {
  teacher: Teacher
  onClose: () => void
  onUpdate: (updatedTeacher: Teacher) => void
}

export default function EditTeacherModal({ teacher, onClose, onUpdate }: EditTeacherModalProps) {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const formData = new FormData(event.currentTarget)

    try {
      const updatedTeacher = await updateTeacher(teacher._id, {
        name: formData.get("name") as string,
        experience: Number(formData.get("experience")),
        notes: formData.get("notes") as string,
      })
      onUpdate(updatedTeacher)
      router.refresh()
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Teacher: {teacher.name}</DialogTitle>
        </DialogHeader>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={teacher.name} required />
          </div>
          <div>
            <Label htmlFor="experience">Experience</Label>
            <Textarea
              id="experience"
              name="experience"
              defaultValue={teacher.experience}
              placeholder="Describe the teacher's experience..."
              className="h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={teacher.notes} />
          </div>
          <Button type="submit">Update Teacher</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

