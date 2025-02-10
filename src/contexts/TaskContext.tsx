
import React, { createContext, useContext, useState, useCallback } from "react";
import { Task, RepeatFrequency } from "@/types/task";
import { addDays, addWeeks, addMonths } from "date-fns";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updatedTask: Task) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const completed = !task.completed;
        
        // If task is not completed or is not repeating, just toggle the status
        if (!completed || task.repeatFrequency === "once") {
          return { ...task, completed };
        }

        // Create next occurrence for repeating tasks
        let nextDueDate = new Date(task.dueDate);
        switch (task.repeatFrequency) {
          case "daily":
            nextDueDate = addDays(nextDueDate, 1);
            break;
          case "weekly":
            nextDueDate = addWeeks(nextDueDate, 1);
            break;
          case "monthly":
            nextDueDate = addMonths(nextDueDate, 1);
            break;
          case "custom":
            // Find next occurrence based on custom days
            if (task.customDays?.length) {
              const today = new Date().getDate();
              const nextDay = task.customDays.find(day => day > today);
              if (nextDay) {
                nextDueDate.setDate(nextDay);
              } else {
                nextDueDate = addMonths(nextDueDate, 1);
                nextDueDate.setDate(task.customDays[0]);
              }
            }
            break;
        }

        // Create new task instance for next occurrence
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          completed: false,
          dueDate: nextDueDate,
          createdAt: new Date(),
        };

        setTasks((tasks) => [...tasks, newTask]);
        return { ...task, completed };
      })
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
