import type { ComponentProps } from "react";
import type { Href } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type HomeMenuItem = {
  key: string;
  labelKey: string;
  icon: ComponentProps<typeof MaterialCommunityIcons>["name"];
  route?: Href;
};

export const MENU_ITEMS: HomeMenuItem[] = [
  {
    key: "location",
    labelKey: "location",
    icon: "map-marker",
    route: "/Parent/childLocation" as Href,
  },
  {
    key: "history",
    labelKey: "history",
    icon: "history",
    route: "/Parent/activityHistory" as Href,
  },
  {
    key: "extensionRequests",
    labelKey: "extensionRequests",
    icon: "clock-check-outline",
    route: "/Parent/extensionRequests" as Href,
  },
  {
    key: "tasks",
    labelKey: "tasks",
    icon: "format-list-checkbox",
    route: "/Parent/tasks" as Href,
  },
   {
    key: "rewards",
    labelKey: "rewards",
    icon: "diamond-stone",
    route: "/Parent/rewards" as Href,
  },
  {
    key: "chatbot",
    labelKey: "chatbot",
    icon: "chat-processing-outline",
    route: "/Parent/chatbot" as Href,
  },
];
