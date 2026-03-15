import { headers } from "next/headers";
import { auth, Session } from "./auth";

export const getServerSession = async (): Promise<Session | null> => {
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

type AuthRequiredOptions = {
  verified?: boolean;
};

export const authRequired = async (
  options: AuthRequiredOptions = {},
): Promise<Awaited<ReturnType<typeof getServerSession>>> => {
  const { verified = false } = options;
  const session = await getServerSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized: user authentication required.");
  }
  if (verified && !session.user.emailVerified) {
    throw new Error("Forbidden: Email is not verified.");
  }
  return session;
};
