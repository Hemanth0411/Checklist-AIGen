
import { useTaskContext } from "@/contexts/TaskContext";
import { TaskCard } from "./TaskCard";
import { AnimatePresence } from "framer-motion";

export function TaskList() {
  const { tasks } = useTaskContext();
  const sortedTasks = [...tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </AnimatePresence>
    </div>
  );
}
