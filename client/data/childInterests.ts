import type { MaterialCommunityIcons } from "@expo/vector-icons";

export type ChildInterest = {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  color: string; // accent
  softColor: string; // background for badges
};

export const CHILD_INTERESTS: ChildInterest[] = [
  { key: "SPORT", label: "Sports", icon: "soccer", color: "#2563EB", softColor: "#EAF2FF" },
  { key: "CYCLING", label: "Bike riding", icon: "bike", color: "#0EA5E9", softColor: "#E0F2FE" },
  { key: "RUNNING", label: "Running", icon: "run", color: "#F97316", softColor: "#FFEDD5" },
  { key: "SWIMMING", label: "Swimming", icon: "swim", color: "#06B6D4", softColor: "#CFFAFE" },
  { key: "SOCCER", label: "Soccer", icon: "soccer-field", color: "#22C55E", softColor: "#DCFCE7" },
  { key: "BASKETBALL", label: "Basketball", icon: "basketball", color: "#FB923C", softColor: "#FFEDD5" },
  { key: "TENNIS", label: "Tennis", icon: "tennis", color: "#84CC16", softColor: "#ECFCCB" },
  { key: "MARTIAL_ARTS", label: "Martial arts", icon: "karate", color: "#EF4444", softColor: "#FEE2E2" },
  { key: "SKATING", label: "Skating", icon: "skateboard", color: "#A855F7", softColor: "#F3E8FF" },
  { key: "JUMP_ROPE", label: "Jump rope", icon: "jump-rope", color: "#F43F5E", softColor: "#FFE4E6" },
  { key: "HIKING", label: "Hiking", icon: "hiking", color: "#16A34A", softColor: "#DCFCE7" },

  { key: "DRAWING", label: "Drawing", icon: "draw", color: "#8B5CF6", softColor: "#EDE9FE" },
  { key: "COLORING", label: "Coloring", icon: "format-color-fill", color: "#EC4899", softColor: "#FCE7F3" },
  { key: "PAINTING", label: "Painting", icon: "palette", color: "#6366F1", softColor: "#E0E7FF" },
  { key: "ORIGAMI", label: "Origami", icon: "airplane", color: "#14B8A6", softColor: "#CCFBF1" },
  { key: "CLAY", label: "Clay / Play-dough", icon: "shaker", color: "#F59E0B", softColor: "#FEF3C7" },
  { key: "CRAFTS", label: "Arts & crafts", icon: "scissors-cutting", color: "#A855F7", softColor: "#F3E8FF" },
  { key: "DIY", label: "DIY projects", icon: "tools", color: "#0EA5E9", softColor: "#E0F2FE" },

  { key: "MUSIC", label: "Music", icon: "music", color: "#3B82F6", softColor: "#DBEAFE" },
  { key: "SINGING", label: "Singing", icon: "microphone", color: "#F43F5E", softColor: "#FFE4E6" },
  { key: "PIANO", label: "Piano", icon: "piano", color: "#111827", softColor: "#E5E7EB" },
  { key: "GUITAR", label: "Guitar", icon: "guitar-acoustic", color: "#F97316", softColor: "#FFEDD5" },
  { key: "DRUMS", label: "Drums", icon: "music-circle", color: "#EF4444", softColor: "#FEE2E2" },
  { key: "DANCE", label: "Dancing", icon: "dance-ballroom", color: "#EC4899", softColor: "#FCE7F3" },

  { key: "COOKING", label: "Cooking", icon: "chef-hat", color: "#F97316", softColor: "#FFEDD5" },
  { key: "BAKING", label: "Baking", icon: "cupcake", color: "#FB7185", softColor: "#FFE4E6" },
  { key: "SNACKS", label: "Making snacks", icon: "food-apple", color: "#22C55E", softColor: "#DCFCE7" },

  { key: "READING", label: "Reading", icon: "book-open-page-variant", color: "#2563EB", softColor: "#DBEAFE" },
  { key: "STORIES", label: "Stories", icon: "book-open-variant", color: "#7C3AED", softColor: "#EDE9FE" },
  { key: "COMICS", label: "Comics", icon: "book-open", color: "#F59E0B", softColor: "#FEF3C7" },
  { key: "POETRY", label: "Poetry", icon: "feather", color: "#14B8A6", softColor: "#CCFBF1" },
  { key: "WRITING", label: "Writing", icon: "pencil", color: "#0EA5E9", softColor: "#E0F2FE" },

  { key: "BOARD_GAMES", label: "Board games", icon: "dice-multiple", color: "#8B5CF6", softColor: "#EDE9FE" },
  { key: "PUZZLES", label: "Puzzles", icon: "puzzle-outline", color: "#22C55E", softColor: "#DCFCE7" },
  { key: "CHESS", label: "Chess", icon: "chess-king", color: "#111827", softColor: "#E5E7EB" },
  { key: "CARDS", label: "Card games", icon: "cards", color: "#EF4444", softColor: "#FEE2E2" },

  { key: "NATURE", label: "Nature", icon: "leaf", color: "#16A34A", softColor: "#DCFCE7" },
  { key: "ANIMALS", label: "Animals", icon: "paw", color: "#F59E0B", softColor: "#FEF3C7" },
  { key: "GARDENING", label: "Gardening", icon: "flower", color: "#22C55E", softColor: "#DCFCE7" },
  { key: "PHOTOGRAPHY", label: "Photography", icon: "camera", color: "#0EA5E9", softColor: "#E0F2FE" },

  { key: "SCIENCE", label: "Science", icon: "flask-outline", color: "#06B6D4", softColor: "#CFFAFE" },
  { key: "BUILDING", label: "Building / LEGO", icon: "hammer-screwdriver", color: "#F97316", softColor: "#FFEDD5" },
  { key: "ROBOTS", label: "Robots", icon: "robot", color: "#6366F1", softColor: "#E0E7FF" },
  { key: "CODING", label: "Coding", icon: "code-tags", color: "#2563EB", softColor: "#DBEAFE" },
  { key: "SPACE", label: "Space", icon: "rocket-launch", color: "#8B5CF6", softColor: "#EDE9FE" },
  { key: "DINOSAURS", label: "Dinosaurs", icon: "drag", color: "#22C55E", softColor: "#DCFCE7" },

  { key: "THEATER", label: "Pretend play", icon: "theater", color: "#EC4899", softColor: "#FCE7F3" },
  { key: "MAGIC", label: "Magic tricks", icon: "magic-staff", color: "#A855F7", softColor: "#F3E8FF" },

  { key: "FAMILY", label: "Family time", icon: "account-group", color: "#2563EB", softColor: "#DBEAFE" },
  { key: "FRIENDS", label: "Friends", icon: "account-multiple", color: "#F97316", softColor: "#FFEDD5" },
  { key: "HELPING", label: "Helping at home", icon: "hand-heart", color: "#EF4444", softColor: "#FEE2E2" },
  { key: "VOLUNTEER", label: "Helping others", icon: "hand-heart", color: "#14B8A6", softColor: "#CCFBF1" },

  { key: "OUTDOOR", label: "Outdoor", icon: "tree-outline", color: "#16A34A", softColor: "#DCFCE7" },
  { key: "INDOOR", label: "Indoor", icon: "home-outline", color: "#0EA5E9", softColor: "#E0F2FE" },
  { key: "QUIET", label: "Quiet time", icon: "weather-night", color: "#6366F1", softColor: "#E0E7FF" },
  { key: "ACTIVE", label: "Active play", icon: "flash", color: "#F97316", softColor: "#FFEDD5" },

  { key: "BREATHING", label: "Breathing", icon: "weather-windy", color: "#06B6D4", softColor: "#CFFAFE" },
  { key: "MEDITATION", label: "Meditation", icon: "meditation", color: "#7C3AED", softColor: "#EDE9FE" },
  { key: "HOMEWORK", label: "Homework", icon: "clipboard-text-outline", color: "#F59E0B", softColor: "#FEF3C7" },
];

export const CHILD_INTERESTS_BY_KEY = Object.fromEntries(
  CHILD_INTERESTS.map((i) => [i.key, i])
) as Record<string, ChildInterest>;

