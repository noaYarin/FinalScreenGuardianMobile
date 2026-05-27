import type { ComponentProps } from "react";
import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type ChildGoalIcon = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

export type BadgeRule =
  | "single_day"
  | "days_in_week"
  | "weekly_total"
  | "beat_last_week";

export type ChildGoal = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  icon: ChildGoalIcon;
  color: string;
  heroTint: string;
  rule: BadgeRule;
  maxMinutes?: number;
  daysRequired?: number;
};

export const badges: ChildGoal[] = [
  {
    id: 1,
    title: "Under 1 hour today",
    description: "Finish one full day with less than 1 hour of screen time",
    completed: false,
    icon: "clock-outline",
    color: "#EAB308",
    heroTint: "#FEFCE8",
    rule: "single_day",
    maxMinutes: 60,
  },
  {
    id: 2,
    title: "3 days under 2 hours",
    description: "On 3 different days this week, stay under 2 hours each day",
    completed: false,
    icon: "calendar-check-outline",
    color: "#F59E0B",
    heroTint: "#FFFBEB",
    rule: "days_in_week",
    maxMinutes: 120,
    daysRequired: 3,
  },
  {
    id: 3,
    title: "4 hours this week",
    description: "Keep your total screen time under 4 hours for the whole week",
    completed: false,
    icon: "calendar-week-outline",
    color: "#4F46E5",
    heroTint: "#EEF2FF",
    rule: "weekly_total",
    maxMinutes: 240,
  },
  {
    id: 4,
    title: "5 days under 3 hours",
    description: "On 5 different days this week, stay under 3 hours each day",
    completed: false,
    icon: "cellphone",
    color: "#16A34A",
    heroTint: "#F0FDF4",
    rule: "days_in_week",
    maxMinutes: 180,
    daysRequired: 5,
  },
  {
    id: 5,
    title: "8 hours this week",
    description: "Keep your total screen time under 8 hours for the whole week",
    completed: false,
    icon: "calendar-clock",
    color: "#0D9488",
    heroTint: "#F0FDFA",
    rule: "weekly_total",
    maxMinutes: 480,
  },
  {
    id: 6,
    title: "12 hours this week",
    description: "Keep your total screen time under 12 hours for the whole week",
    completed: false,
    icon: "chart-timeline-variant",
    color: "#7C3AED",
    heroTint: "#FAF5FF",
    rule: "weekly_total",
    maxMinutes: 720,
  },
  {
    id: 7,
    title: "Better than last week",
    description: "Finish the week with less total screen time than last week",
    completed: false,
    icon: "trending-down",
    color: "#DB2777",
    heroTint: "#FDF2F8",
    rule: "beat_last_week",
  },
];
