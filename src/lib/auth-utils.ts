import { headers } from "next/headers";
import { auth } from "./auth";

export const getServerSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};
