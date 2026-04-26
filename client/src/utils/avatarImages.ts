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

export const defaultAvatarImage = require("../../assets/images/avatars/avatar_boy_stage_1.png");

function normalizeAvatarGender(gender?: ChildGender | string | null) {
  return gender === "girl" ? "girl" : "boy";
}

/*
  Avatar stage is based on the same logic as the server:
  Level 1-2  -> stage 1
  Level 3-4  -> stage 2
  Level 5-6  -> stage 3
  Level 7-8  -> stage 4
  Level 9+   -> stage 5
*/
export function getAvatarStageFromLevel(level?: number | null) {
  const numericLevel = Number(level);

  if (!Number.isFinite(numericLevel) || numericLevel <= 0) {
    return 1;
  }

  if (numericLevel >= 9) return 5;
  if (numericLevel >= 7) return 4;
  if (numericLevel >= 5) return 3;
  if (numericLevel >= 3) return 2;

  return 1;
}

function isAvatarImageMatchingGender(
  imageName: string,
  gender: "boy" | "girl"
) {
  return imageName.startsWith(`avatar_${gender}_`);
}

export function getAvatarImage(params?: {
  gender?: ChildGender | string | null;
  level?: number | null;
  imageName?: string | null;
}) {
  const gender = normalizeAvatarGender(params?.gender);
  const directImageName = params?.imageName?.trim();

  /*
    Use the image saved on the server only if it matches the current gender.
    This prevents a case where the child gender was changed to "boy",
    but avatar.img still contains "avatar_girl_stage_3.png".
  */
  if (
    directImageName &&
    avatarImages[directImageName] &&
    isAvatarImageMatchingGender(directImageName, gender)
  ) {
    return avatarImages[directImageName];
  }

  const stage = getAvatarStageFromLevel(params?.level);
  const imageName = `avatar_${gender}_stage_${stage}.png`;

  return avatarImages[imageName] ?? defaultAvatarImage;
}