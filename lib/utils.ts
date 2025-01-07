import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function updatePxFields<T extends { px: number }>(items: T[]): T[] {
  return items.map((item, index) => ({
    ...item,
    px: index + 1, // 从 1 开始编号
  }));
}

export function getCurrentWeekRange(): [Date, Date] {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - now.getDay()));
  const end = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  return [start, end];
}

export function getLastWeekRange(): [Date, Date] {
  const now = new Date();
  const start = new Date(now.setDate(now.getDate() - now.getDay() - 7));
  const end = new Date(now.setDate(now.getDate() - now.getDay() - 1));
  return [start, end];
}

export function getCurrentMonthRange(): [Date, Date] {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return [start, end];
}