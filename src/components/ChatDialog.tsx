
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTaskContext } from "@/contexts/TaskContext";
import { format, addDays, parse } from "date-fns";

export function ChatDialog() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const { addTask } = useTaskContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic natural language parsing (this is a simple example)
    const msg = message.toLowerCase();
    
    // Extract frequency
    let repeatFrequency = "once";
    if (msg.includes("every day") || msg.includes("daily")) {
      repeatFrequency = "daily";
    } else if (msg.includes("every week") || msg.includes("weekly")) {
      repeatFrequency = "weekly";
    } else if (msg.includes("every month") || msg.includes("monthly")) {
      repeatFrequency = "monthly";
    }

    // Extract title (simple version - takes everything before "every" or whole message if no frequency)
    const title = message.split(/\s+(?:every|daily|weekly|monthly)/i)[0].trim();

    addTask({
      title,
      description: "",
      completed: false,
      repeatFrequency: repeatFrequency as any,
      dueDate: new Date(),
    });

    setMessage("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10">
          <MessageSquare className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Add Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Add workout every Monday..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-20 resize-none"
            />
          </div>
          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
