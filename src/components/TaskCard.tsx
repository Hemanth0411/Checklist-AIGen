
import { Task } from "@/types/task";
import { useTaskContext } from "@/contexts/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Repeat, Trash2, Edit, Flame } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { toggleTask, deleteTask, updateTask } = useTaskContext();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || "");
  const [editedRepeatFrequency, setEditedRepeatFrequency] = useState<Task["repeatFrequency"]>(task.repeatFrequency);

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTask(task.id, {
      ...task,
      title: editedTitle,
      description: editedDescription,
      repeatFrequency: editedRepeatFrequency,
    });
    setIsEditDialogOpen(false);
  };

  const showStreak = ["daily", "weekly"].includes(task.repeatFrequency) && task.currentStreak > 0;

  return (
    <>
      <motion.div
        layout
        className="group relative overflow-hidden rounded-xl border border-task-border bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm transition-all hover:shadow-md"
      >
        <div className="flex items-start gap-4">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTask(task.id)}
            className="mt-1 h-5 w-5 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3
                className={`text-lg font-medium transition-colors ${
                  task.completed ? "text-muted-foreground line-through" : ""
                }`}
              >
                {task.title}
              </h3>
              {showStreak && (
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm font-medium">{task.currentStreak}</span>
                </div>
              )}
            </div>
            {task.description && (
              <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
            )}
            <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{format(task.dueDate, "MMM d, yyyy")}</span>
              {task.repeatFrequency !== "once" && (
                <div className="flex items-center gap-1">
                  <Repeat className="h-4 w-4" />
                  <span className="capitalize">{task.repeatFrequency}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => deleteTask(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
      </motion.div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repeat">Repeat</Label>
              <Select
                value={editedRepeatFrequency}
                onValueChange={setEditedRepeatFrequency}
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
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
