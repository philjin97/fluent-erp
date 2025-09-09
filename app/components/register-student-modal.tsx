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
 * 2) phoneNumber (digits only)
 * 3) teacher (teacher name)
 * 4) classStartDate (YYYY. MM. DD. on submit; input uses native date picker)
 * 5) repeatDays (multi-select checkboxes: Mon–Sun; stored as comma-separated string)
 * 6) classTime (HH:mm)
 */
export default function RegisterStudentModal() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
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
    const classTime = String(raw.get("classTime") || ""); // HH:mm from <input type="time">

    // Collect repeat days from checked boxes
    const checked = Array.from(
      formEl.querySelectorAll<HTMLInputElement>('input[name="repeatDays"]:checked')
    ).map((el) => el.value);

    // Digits-only phone number
    const phoneDigits = String(raw.get("phoneNumber") || "").replace(/\D+/g, "");

    // Basic validations
    if (!name) return setError("Name is required.");
    if (!phoneDigits) return setError("Phone number must contain digits only.");
    if (!teacher) return setError("Teacher name is required.");
    if (!classStartDateISO) return setError("Class start date is required.");
    if (!checked.length) return setError("Select at least one repeat day.");
    if (!classTime) return setError("Class time is required.");

    const classStartDate = formatDateYMDdots(classStartDateISO);
    if (!/^\d{4}\.\s\d{2}\.\s\d{2}\.$/.test(classStartDate)) {
      return setError("Date must be in YYYY. MM. DD. format.");
    }

    // Build clean FormData for server action
    const fd = new FormData();
    fd.set("name", name);
    fd.set("phoneNumber", phoneDigits);
    fd.set("teacher", teacher);
    fd.set("classStartDate", classStartDate); // e.g., "2025. 09. 09."
    fd.set("repeatDays", checked.join(",")); // e.g., "Mon,Wed,Fri"
    fd.set("classTime", classTime); // e.g., "14:30"

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
              inputMode="numeric"
              pattern="\\d*"
              required
              value={phone}
              onChange={(e) => {
                // Keep only digits in state
                const digits = e.target.value.replace(/\D+/g, "");
                setPhone(digits);
              }}
              placeholder="Digits only"
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
            <Label htmlFor="classTime">Class Time</Label>
            <Input id="classTime" name="classTime" type="time" required />
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
