import type { ChildGender } from "@/src/redux/slices/children-slice";

export const avatarImages: Record<string, any> = {
  "avatar_boy_stage_1.png": require("../../assets/images/avatars/avatar_boy_stage_1.png"),
  "avatar_boy_stage_2.png": require("../../assets/images/avatars/avatar_boy_stage_2.png"),
  "avatar_boy_stage_3.png": require("../../assets/images/avatars/avatar_boy_stage_3.png"),
  "avatar_boy_stage_4.png": require("../../assets/images/avatars/avatar_boy_stage_4.png"),
  "avatar_boy_stage_5.png": require("../../assets/images/avatars/avatar_boy_stage_5.png"),

  "avatar_girl_stage_1.png": require("../../assets/images/avatars/avatar_girl_stage_1.png"),
  "avatar_girl_stage_2.png": require("../../assets/images/avatars/avatar_girl_stage_2.png"),
  "avatar_girl_stage_3.png": require("../../assets/images/avatars/avatar_girl_stage_3.png"),
  "avatar_girl_stage_4.png": require("../../assets/images/avatars/avatar_girl_stage_4.png"),
  "avatar_girl_stage_5.png": require("../../assets/images/avatars/avatar_girl_stage_5.png"),
};

export const defaultAvatarImage =
  require("../../assets/images/avatars/avatar_boy_stage_1.png");

function normalizeAvatarGender(gender?: ChildGender | string | null) {
  return gender === "girl" ? "girl" : "boy";
}

function normalizeAvatarStage(level?: number | null) {
  const numericLevel = Number(level);

  if (!Number.isFinite(numericLevel) || numericLevel <= 0) {
    return 1;
  }

  return Math.min(Math.max(Math.floor(numericLevel), 1), 5);
}

export function getAvatarImage(params?: {
  gender?: ChildGender | string | null;
  level?: number | null;
  imageName?: string | null;
}) {
  const directImageName = params?.imageName?.trim();

  if (directImageName && avatarImages[directImageName]) {
    return avatarImages[directImageName];
  }

  const gender = normalizeAvatarGender(params?.gender);
  const stage = normalizeAvatarStage(params?.level);
  const imageName = `avatar_${gender}_stage_${stage}.png`;

  return avatarImages[imageName] ?? defaultAvatarImage;
}