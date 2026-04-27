import type { MaterialCommunityIcons } from "@expo/vector-icons";
import { CHILD_INTERESTS_BY_KEY } from "@/data/childInterests";

export type ChildActivity = {
  id: string;
  title: string;
  description: string;
  interestKeys: string[];
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  accentColor: string;
  softColor: string;
};

const BASE_ACTIVITIES: ChildActivity[] = [
  {
    id: "bike_ride",
    title: "Go for a bike ride",
    description: "Ride around the neighborhood or the park.",
    interestKeys: ["CYCLING", "SPORT", "OUTDOOR", "ACTIVE"],
    icon: "bike",
    accentColor: "#0EA5E9",
    softColor: "#E0F2FE",
  },
  {
    id: "read_book",
    title: "Read an interesting book",
    description: "Pick a story and read a few chapters.",
    interestKeys: ["READING", "STORIES", "QUIET", "INDOOR"],
    icon: "book-open-page-variant",
    accentColor: "#2563EB",
    softColor: "#DBEAFE",
  },
  {
    id: "draw_color",
    title: "Draw or color",
    description: "Make a new drawing or color your favorite picture.",
    interestKeys: ["DRAWING", "COLORING", "CRAFTS", "INDOOR", "QUIET"],
    icon: "pen",
    accentColor: "#8B5CF6",
    softColor: "#EDE9FE",
  },
  {
    id: "play_music",
    title: "Play or listen to music",
    description: "Sing, play an instrument, or make a playlist.",
    interestKeys: ["MUSIC", "SINGING", "INDOOR", "QUIET"],
    icon: "music",
    accentColor: "#3B82F6",
    softColor: "#DBEAFE",
  },

  // Sports / active
  {
    id: "soccer_drills",
    title: "Soccer trick shots",
    description: "Try 10 shots and beat your own record!",
    interestKeys: ["SOCCER", "SPORT", "OUTDOOR", "ACTIVE"],
    icon: "soccer",
    accentColor: "#22C55E",
    softColor: "#DCFCE7",
  },
  {
    id: "basketball_free_throws",
    title: "Basketball free throws",
    description: "Practice 20 throws and beat your own record.",
    interestKeys: ["BASKETBALL", "SPORT", "OUTDOOR", "ACTIVE"],
    icon: "basketball",
    accentColor: "#FB923C",
    softColor: "#FFEDD5",
  },
  {
    id: "jump_rope_challenge",
    title: "Jump rope challenge",
    description: "Can you do 50 jumps without stopping?",
    interestKeys: ["JUMP_ROPE", "SPORT", "ACTIVE", "OUTDOOR"],
    icon: "jump-rope",
    accentColor: "#F43F5E",
    softColor: "#FFE4E6",
  },
  {
    id: "mini_obstacle_course",
    title: "Mini obstacle course",
    description: "Use pillows, cones, and chairs to build a course.",
    interestKeys: ["ACTIVE", "SPORT", "INDOOR"],
    icon: "run",
    accentColor: "#F97316",
    softColor: "#FFEDD5",
  },
  {
    id: "sports_stretching",
    title: "Stretching break",
    description: "Do 5 easy stretches: arms, legs, and back.",
    interestKeys: ["SPORT", "ACTIVE", "INDOOR"],
    icon: "arm-flex-outline",
    accentColor: "#2563EB",
    softColor: "#EAF2FF",
  },

  // Creative
  {
    id: "paint_poster",
    title: "Paint a mini poster",
    description: "Pick a theme: space, animals, or superheroes.",
    interestKeys: ["PAINTING", "DRAWING", "CRAFTS", "INDOOR"],
    icon: "palette",
    accentColor: "#6366F1",
    softColor: "#E0E7FF",
  },
  {
    id: "origami_animals",
    title: "Origami animals",
    description: "Fold a frog, a crane, or a cat.",
    interestKeys: ["ORIGAMI", "CRAFTS", "QUIET", "INDOOR"],
    icon: "airplane",
    accentColor: "#14B8A6",
    softColor: "#CCFBF1",
  },
  {
    id: "clay_creatures",
    title: "Make clay creatures",
    description: "Create 3 funny creatures and name them!",
    interestKeys: ["CLAY", "CRAFTS", "CREATIVE", "INDOOR"],
    icon: "shaker",
    accentColor: "#F59E0B",
    softColor: "#FEF3C7",
  },
  {
    id: "make_comic",
    title: "Create a comic strip",
    description: "Draw 4 panels with a fun story.",
    interestKeys: ["COMICS", "DRAWING", "WRITING", "INDOOR", "QUIET"],
    icon: "book-open",
    accentColor: "#F59E0B",
    softColor: "#FEF3C7",
  },

  // Science / building
  {
    id: "science_volcano",
    title: "Mini volcano experiment",
    description: "Baking soda + vinegar = bubbly fun!",
    interestKeys: ["SCIENCE", "INDOOR", "QUIET"],
    icon: "flask-outline",
    accentColor: "#06B6D4",
    softColor: "#CFFAFE",
  },
  {
    id: "lego_tower",
    title: "Build the tallest LEGO tower",
    description: "How tall can you build before it falls?",
    interestKeys: ["BUILDING", "INDOOR", "QUIET"],
    icon: "hammer-screwdriver",
    accentColor: "#F97316",
    softColor: "#FFEDD5",
  },
  {
    id: "robot_story",
    title: "Invent a robot helper",
    description: "Draw it, name it, and decide what it helps with.",
    interestKeys: ["ROBOTS", "SCIENCE", "DRAWING", "INDOOR"],
    icon: "robot",
    accentColor: "#6366F1",
    softColor: "#E0E7FF",
  },

  // Nature / animals
  {
    id: "nature_walk",
    title: "Nature walk bingo",
    description: "Find: a leaf, a flower, a bird, a rock, and a bug.",
    interestKeys: ["NATURE", "OUTDOOR", "ACTIVE"],
    icon: "leaf",
    accentColor: "#16A34A",
    softColor: "#DCFCE7",
  },
  {
    id: "animal_spotting",
    title: "Animal spotting",
    description: "See how many birds/cats you can spot safely.",
    interestKeys: ["ANIMALS", "NATURE", "OUTDOOR", "QUIET"],
    icon: "paw",
    accentColor: "#F59E0B",
    softColor: "#FEF3C7",
  },

  // Home / family
  {
    id: "bake_together",
    title: "Bake something together",
    description: "Cookies, muffins, or pancakes are great choices.",
    interestKeys: ["BAKING", "COOKING", "FAMILY", "INDOOR"],
    icon: "cupcake",
    accentColor: "#FB7185",
    softColor: "#FFE4E6",
  },
  {
    id: "help_home",
    title: "Help at home",
    description: "Set the table, water plants, or sort toys.",
    interestKeys: ["HELPING", "FAMILY", "INDOOR"],
    icon: "hand-heart",
    accentColor: "#EF4444",
    softColor: "#FEE2E2",
  },

  // Breathing / meditation / homework
  {
    id: "breathing_square",
    title: "Square breathing",
    description: "Breathe in 4, hold 4, out 4, hold 4. Repeat 3 times.",
    interestKeys: ["BREATHING", "QUIET", "INDOOR"],
    icon: "weather-windy",
    accentColor: "#06B6D4",
    softColor: "#CFFAFE",
  },
  {
    id: "breathing_balloon",
    title: "Balloon breathing",
    description: "Imagine a balloon. Inhale to fill it, exhale to empty it.",
    interestKeys: ["BREATHING", "QUIET", "INDOOR"],
    icon: "weather-windy",
    accentColor: "#06B6D4",
    softColor: "#CFFAFE",
  },
  {
    id: "breathing_five_fingers",
    title: "5-finger breathing",
    description: "Trace your hand—inhale up a finger, exhale down.",
    interestKeys: ["BREATHING", "QUIET", "INDOOR"],
    icon: "weather-windy",
    accentColor: "#06B6D4",
    softColor: "#CFFAFE",
  },
  {
    id: "meditation_one_minute",
    title: "1-minute calm",
    description: "Sit still, listen to sounds, and breathe slowly.",
    interestKeys: ["MEDITATION", "QUIET", "INDOOR"],
    icon: "meditation",
    accentColor: "#7C3AED",
    softColor: "#EDE9FE",
  },
  {
    id: "meditation_body_scan",
    title: "Body scan",
    description: "Notice: toes, legs, tummy, hands, shoulders, face.",
    interestKeys: ["MEDITATION", "QUIET", "INDOOR"],
    icon: "meditation",
    accentColor: "#7C3AED",
    softColor: "#EDE9FE",
  },
  {
    id: "meditation_gratitude",
    title: "Gratitude moment",
    description: "Think of 3 good things from today.",
    interestKeys: ["MEDITATION", "QUIET", "INDOOR"],
    icon: "meditation",
    accentColor: "#7C3AED",
    softColor: "#EDE9FE",
  },
  {
    id: "homework_ten_min_focus",
    title: "10-minute homework focus",
    description: "Set a timer for 10 minutes and do your first task.",
    interestKeys: ["HOMEWORK", "INDOOR", "QUIET"],
    icon: "clipboard-text-outline",
    accentColor: "#F59E0B",
    softColor: "#FEF3C7",
  },
  {
    id: "homework_pack_bag",
    title: "Pack your school bag",
    description: "Put books, pencil case, and homework in one place.",
    interestKeys: ["HOMEWORK", "INDOOR", "QUIET"],
    icon: "briefcase-outline",
    accentColor: "#F59E0B",
    softColor: "#FEF3C7",
  },
  {
    id: "homework_neat_desk",
    title: "Clean your homework desk",
    description: "Clear space, get water, and keep only what you need.",
    interestKeys: ["HOMEWORK", "INDOOR", "QUIET"],
    icon: "desk",
    accentColor: "#F59E0B",
    softColor: "#FEF3C7",
  },
];

function makeAutoActivitiesForInterest(key: string, needed: number): ChildActivity[] {
  const meta = CHILD_INTERESTS_BY_KEY[key];
  const label = meta?.label || key;
  const icon = meta?.icon || "lightbulb-on-outline";
  const accentColor = meta?.color || "#2563EB";
  const softColor = meta?.softColor || "#EAF2FF";

  const templates = [
    {
      t: `${label} mini challenge`,
      d: `Try a quick ${label.toLowerCase()} challenge and beat your own record.`,
    },
    {
      t: `${label} with a friend`,
      d: `Invite a friend or family member and do a ${label.toLowerCase()} activity together.`,
    },
    {
      t: `${label} level-up`,
      d: `Pick one small goal in ${label.toLowerCase()} and practice for 10 minutes.`,
    },
    {
      t: `${label} creative twist`,
      d: `Do ${label.toLowerCase()} in a new way—make it silly, colorful, or extra fun.`,
    },
  ];

  const out: ChildActivity[] = [];
  for (let i = 0; i < needed; i++) {
    const tpl = templates[i % templates.length];
    out.push({
      id: `${key.toLowerCase()}_auto_${i + 1}`,
      title: tpl.t,
      description: tpl.d,
      interestKeys: [key],
      icon,
      accentColor,
      softColor,
    });
  }
  return out;
}

function buildAllActivities(): ChildActivity[] {
  const list = [...BASE_ACTIVITIES];
  const counts: Record<string, number> = {};
  for (const activity of list) {
    for (const key of activity.interestKeys) {
      counts[key] = (counts[key] || 0) + 1;
    }
  }

  // Ensure every interest key has multiple activities.
  for (const key of Object.keys(CHILD_INTERESTS_BY_KEY)) {
    const current = counts[key] || 0;
    const minPerInterest = 3;
    if (current >= minPerInterest) continue;
    const needed = minPerInterest - current;
    const auto = makeAutoActivitiesForInterest(key, needed);
    list.push(...auto);
  }

  return list;
}

export const CHILD_ACTIVITIES: ChildActivity[] = buildAllActivities();

export const POPULAR_ACTIVITIES: ChildActivity[] = CHILD_ACTIVITIES.filter((a) =>
  ["bike_ride", "read_book", "draw_color", "play_music", "nature_walk"].includes(a.id)
);

