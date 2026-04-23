export type ChatbotRole = "PARENT" | "CHILD";
export type ChatbotTargetRole = ChatbotRole | "BOTH";

export type ChatbotItem = {
  menuOptionNumber: number;
  question: string;
  answer: string;
  targetRole: ChatbotTargetRole;
};

export const CHATBOT_ITEMS: ChatbotItem[] = [
  {
    menuOptionNumber: 1,
    question: "How much screen time is recommended?",
    answer:
      "General guidance: ages 6–12 about 1–2 hours/day, and ages 13–17 about 2–3 hours/day. The most important thing is balance and a consistent routine.",
    targetRole: "BOTH",
  },
  {
    menuOptionNumber: 3,
    question: "Tips for parents",
    answer:
      "Quick tip: set clear screen-time rules, include offline activities, and occasionally review the installed apps together with your child.",
    targetRole: "PARENT",
  },
  {
    menuOptionNumber: 4,
    question: "How do I limit apps?",
    answer:
      "To limit apps: set a daily time limit, define screen-free sleep hours, and block distracting apps. You can also set learning-related exceptions.",
    targetRole: "PARENT",
  },
  {
    menuOptionNumber: 5,
    question: "How to encourage a child to put the phone down?",
    answer:
      "Try making it collaborative and specific: agree on a short screen-free block (e.g., 20 minutes), offer a concrete alternative (game, snack, walk), use a timer, and praise the effort. Consistency matters more than perfection.",
    targetRole: "PARENT",
  },
  {
    menuOptionNumber: 6,
    question: "Offline activity ideas",
    answer:
      "Here are a few offline ideas: a short walk or bike ride, a board game, drawing/crafts, cooking something simple together, building with LEGO, a scavenger hunt, or a quick sports challenge. Pick one and keep it easy to start.",
    targetRole: "BOTH",
  },
];

