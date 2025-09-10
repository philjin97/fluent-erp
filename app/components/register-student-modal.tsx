"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addStudent } from "@/lib/actions";

/**
 * Minimal Register Student form with exactly 6 mandatory fields:
 * 1) name
 * 2) phoneNumber (string)
 * 3) teacher (teacher name)
 * 4) classStartDate (YYYY. MM. DD. on submit; input uses native date picker)
 * 5) repeatDays (multi-select checkboxes: Mon–Sun; stored as comma-separated string)
 * 6) classTime (0–24)
 */
export default function RegisterStudentModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
  const router = useRouter();

  const formatDateYMDdots = (isoDate: string) => {
    // isoDate expected like "2025-09-09"; output "2025. 09. 09."
    if (!isoDate) return "";
    const [y, m = "", d = ""] = isoDate.split("-");
    if (y?.length !== 4) return "";
    const mm = m.padStart(2, "0");
    const dd = d.padStart(2, "0");
    return `${y}. ${mm}. ${dd}.`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formEl = event.currentTarget;
    const raw = new FormData(formEl);

    // Normalize and validate fields
    const name = String(raw.get("name") || "").trim();
    const teacher = String(raw.get("teacher") || "").trim();
    const classStartDateISO = String(raw.get("classStartDate") || ""); // YYYY-MM-DD from <input type="date">
    const classTimeHourRaw = String(raw.get("classTime") || "");
    const classTimeHour = Number(classTimeHourRaw); // HH:mm from <input type="time">

    // Collect repeat days from checked boxes
    const checked = Array.from(
      formEl.querySelectorAll<HTMLInputElement>('input[name="repeatDays"]:checked')
    ).map((el) => el.value);

    // Phone number as-is (string)
    const phoneNumber = String(raw.get("phoneNumber") || "").trim();

    // Basic validations
    if (!name) return setError("Name is required.");
    if (!phoneNumber) return setError("Phone number is required.");
    if (!teacher) return setError("Teacher name is required.");
    if (!classStartDateISO) return setError("Class start date is required.");
    if (!checked.length) return setError("Select at least one repeat day.");
    if (classTimeHourRaw === "") return setError("Class time is required.");
    if (!Number.isInteger(classTimeHour) || classTimeHour < 0 || classTimeHour > 24) {
      return setError("Class time must be an integer hour between 0 and 24.");
    }

    const classStartDate = formatDateYMDdots(classStartDateISO);
    if (!/^\d{4}\.\s\d{2}\.\s\d{2}\.$/.test(classStartDate)) {
      return setError("Date must be in YYYY. MM. DD. format.");
    }

    // Build clean FormData for server action
    const fd = new FormData();
    fd.set("name", name);
    fd.set("phoneNumber", phoneNumber);
    fd.set("teacher", teacher);
    fd.set("classStartDate", classStartDate); // e.g., "2025. 09. 09."
    fd.set("repeatDays", checked.join(",")); // e.g., "Mon,Wed,Fri"
    fd.set("classTime", String(classTimeHour)); // e.g., "14:30"

    try {
      setPending(true);
      await addStudent(fd);
      setOpen(false);
      router.push("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setPending(false);
    }
  };

  // Days of week with stable values for storage
  const DAYS: { label: string; value: string }[] = [
    { label: "Mon", value: "Mon" },
    { label: "Tue", value: "Tue" },
    { label: "Wed", value: "Wed" },
    { label: "Thu", value: "Thu" },
    { label: "Fri", value: "Fri" },
    { label: "Sat", value: "Sat" },
    { label: "Sun", value: "Sun" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Register Student</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] sm:max-h-[650px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register New Student</DialogTitle>
        </DialogHeader>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1) Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>

          {/* 2) Phone Number (digits only) */}
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              required
              placeholder="Phone number"
            />
          </div>

          {/* 3) Teacher name */}
          <div>
            <Label htmlFor="teacher">Teacher Name</Label>
            <Input id="teacher" name="teacher" required />
          </div>

          {/* 4) Class start date (will be sent as YYYY. MM. DD.) */}
          <div>
            <Label htmlFor="classStartDate">Class Start Date</Label>
            <Input id="classStartDate" name="classStartDate" type="date" required />
            <p className="text-xs text-muted-foreground mt-1">
              Saved as <code>YYYY. MM. DD.</code> (e.g., 2025. 09. 09.)
            </p>
          </div>

          {/* 5) Repeat days */}
          <div>
            <Label>Repeat Days</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {DAYS.map((d) => (
                <label key={d.value} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="repeatDays"
                    value={d.value}
                    className="h-4 w-4 rounded border"
                    required={false} // overall group is required; validated in JS
                  />
                  {d.label}
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Select at least one.</p>
          </div>

          {/* 6) Class time */}
          <div>
            <Label htmlFor="classTime">Class Time (0–24)</Label>
            <Input id="classTime" name="classTime" type="number" inputMode="numeric" min={0} max={24} step={1} required />
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
