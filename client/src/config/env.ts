export const API_BASE_URL =
  (typeof process !== "undefined" &&
    process.env?.EXPO_PUBLIC_API_URL) ||
  "";

//When true, the app skips onboarding and the child QR / barcode pairing screen and routes straight
export const TEMP_DEV_OPEN_CHILD_SKIP_BARCODE = true;

export const CSHARP_API_BASE_URL =
  (typeof process !== "undefined" &&
    process.env?.EXPO_PUBLIC_CSHARP_API_URL) ||
  "";
