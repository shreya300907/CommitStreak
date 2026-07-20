"use client"

import { useState } from "react"
import { apiFetch } from "@/lib/apiFetch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function AddTaskModal({ open, onOpenChange, onSuccess }: AddTaskModalProps) {
  const [taskName, setTaskName] = useState("")
  const [frequency, setFrequency] = useState("daily")
  const [submitting, setSubmitting] = useState(false)
  const [durationDays, setDurationDays] = useState(0)
  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault()
    if (!taskName.trim()) return

    setSubmitting(true)
    try {
      await apiFetch("/tasks", {
        method: "POST",
        body: JSON.stringify({
            title: taskName,
            frequency,
            sourceType: "manual",
            goalType: "boolean",
            goalTarget: 1,
            active: true,
            durationDays,
        }),
      })

      setTaskName("") 
      onSuccess()     
      onOpenChange(false) 
    } catch (error) {
      console.error("Failed to add task", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:max-w-[425px] bg-primary-bg">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-secondary-text">Add New Task</DialogTitle>
          <DialogDescription className="text-[13px] sm:text-md text-primary-text">
            Create a new task and start tracking it.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddTask} className="flex flex-col gap-2 sm:gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="e.g., Watching lectures.."
              className="text-primary-text w-full px-3 py-2 border rounded-md text-xs sm:text-sm bg-background"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-medium">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-xs sm:text-sm bg-background text-primary-text "
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {frequency === 'custom' && (
            <div className="flex flex-col gap-2">
              <label className="text-xs sm:text-sm font-medium">Deadline</label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(+e.target.value)}
                placeholder="Days until deadline (1 = today)"
                required
              />
            </div>
          )}
          <DialogFooter className="mt-1 sm:mt-4 border-t border-primary-bg">
            <button 
              className="font-semibold flex-1 border-2 border-btn-bg px-4 py-2 rounded-md cursor-pointer" 
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="font-semibold flex-1 bg-btn-bg text-btn-text px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {submitting ? "Adding..." : "Save Task"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}