
import React, { createContext, useContext, useState, useCallback } from "react";
import { Task, RepeatFrequency } from "@/types/task";
import { addDays, addWeeks, addMonths, differenceInDays, differenceInWeeks, isWithinInterval } from "date-fns";

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "currentStreak">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updatedTask: Task) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt" | "currentStreak">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      currentStreak: 0,
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updatedTask: Task) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );
  }, []);

  const calculateNewStreak = (task: Task, completed: boolean): number => {
    if (!completed) return 0;

    const now = new Date();
    const lastCompleted = task.lastCompletedDate;

    if (!lastCompleted) return 1;

    switch (task.repeatFrequency) {
      case "daily":
        // Check if the last completion was yesterday
        return differenceInDays(now, lastCompleted) <= 1 
          ? task.currentStreak + 1 
          : 1;
      
      case "weekly":
        // Check if the last completion was within the last week
        return differenceInWeeks(now, lastCompleted) <= 1 
          ? task.currentStreak + 1 
          : 1;
      
      default:
        return 0;
    }
  };

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const completed = !task.completed;
        const now = new Date();
        
        // If task is not completed, reset streak
        if (!completed) {
          return { ...task, completed, currentStreak: 0 };
        }

        // Calculate new streak for completed task
        const newStreak = calculateNewStreak(task, completed);
        
        // If task is not repeating or is completed, just update status and streak
        if (task.repeatFrequency === "once") {
          return { 
            ...task, 
            completed,
            currentStreak: newStreak,
            lastCompletedDate: now 
          };
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
          currentStreak: newStreak,
          lastCompletedDate: now,
        };

        setTasks((tasks) => [...tasks, newTask]);
        return { 
          ...task, 
          completed, 
          currentStreak: newStreak,
          lastCompletedDate: now 
        };
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
