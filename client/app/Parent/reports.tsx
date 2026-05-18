import { Redirect, type Href } from "expo-router";

export default function ParentReportsRedirect() {
  return <Redirect href={"/Parent/(tabs)/reports" as Href} />;
}
