
import { Task } from "@/types/task";
import { useTaskContext } from "@/contexts/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Repeat } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { toggleTask } = useTaskContext();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="group relative flex items-center gap-4 rounded-lg border border-task-border bg-task-bg p-4 shadow-sm transition-all hover:shadow-md"
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => toggleTask(task.id)}
        className="h-5 w-5"
      />
      <div className="flex-1">
        <h3
          className={`text-lg font-medium transition-colors ${
            task.completed ? "text-muted-foreground line-through" : ""
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
        )}
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>{format(task.dueDate, "MMM d, yyyy")}</span>
          {task.repeatFrequency !== "once" && (
            <div className="flex items-center gap-1">
              <Repeat className="h-4 w-4" />
              <span className="capitalize">{task.repeatFrequency}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
