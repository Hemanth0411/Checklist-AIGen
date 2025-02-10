import { TaskProvider } from "@/contexts/TaskContext";
import { TaskList } from "@/components/TaskList";
import { Calendar } from "@/components/Calendar";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, MessageSquare } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTaskContext } from "@/contexts/TaskContext";
import { ChatDialog } from "@/components/ChatDialog";

function AddTaskDialog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repeatFrequency, setRepeatFrequency] = useState("once");
  const { addTask } = useTaskContext();
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title,
      description,
      completed: false,
      repeatFrequency: repeatFrequency as any,
      dueDate: new Date(),
    });
    setTitle("");
    setDescription("");
    setRepeatFrequency("once");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repeat">Repeat</Label>
            <Select
              value={repeatFrequency}
              onValueChange={setRepeatFrequency}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Once</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Index() {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <TaskProvider>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Tasks</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowCalendar(!showCalendar)}
              className="h-10 w-10"
            >
              <CalendarIcon className="h-5 w-5" />
            </Button>
            <ChatDialog />
            <AddTaskDialog />
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className={`space-y-6 ${showCalendar ? 'hidden md:block' : ''}`}>
            <h2 className="text-2xl font-semibold">Upcoming Tasks</h2>
            <TaskList />
          </div>
          <div className={`rounded-lg border bg-card p-6 shadow-sm ${!showCalendar ? 'hidden md:block' : ''}`}>
            <Calendar />
          </div>
        </div>
      </div>
    </TaskProvider>
  );
}
