
import { useTaskContext } from "@/contexts/TaskContext";
import { TaskCard } from "./TaskCard";
import { AnimatePresence, motion } from "framer-motion";

export function TaskList() {
  const { tasks } = useTaskContext();
  const sortedTasks = [...tasks].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  return (
    <div className="grid gap-4">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            style={{
              transformOrigin: "center",
            }}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
