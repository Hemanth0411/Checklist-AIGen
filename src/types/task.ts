
export type RepeatFrequency = "once" | "daily" | "weekly" | "monthly" | "custom";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  repeatFrequency: RepeatFrequency;
  customDays?: number[];
  dueDate: Date;
  createdAt: Date;
  currentStreak: number;
  lastCompletedDate?: Date;
}
