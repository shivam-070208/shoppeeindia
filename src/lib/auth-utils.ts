import { headers } from "next/headers";
import { auth } from "./auth";
import { prisma } from "./db";

export type ServerSession = Awaited<ReturnType<typeof getServerSession>>;

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

export const getServerAdminFlags = async () => {
  const session = await getServerSession();
  const userId = session?.user?.id;
  if (!userId) return { isAdmin: false, isSuperAdmin: false };

  const admin = await prisma.admin.findUnique({
    where: { userId },
    select: { id: true, isSuperAdmin: true },
  });

  return {
    isAdmin: Boolean(admin),
    isSuperAdmin: Boolean(admin?.isSuperAdmin),
  };
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

type AdminAuthRequiredOptions = {
  verified?: boolean;
};

export const adminAuthRequired = async (
  options: AdminAuthRequiredOptions = {},
): Promise<Awaited<ReturnType<typeof getServerSession>>> => {
  const { verified = false } = options;
  const session = await getServerSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized: user authentication required.");
  }
  if (verified && !session.user.emailVerified) {
    throw new Error("Forbidden: Email is not verified.");
  }
  const admin = await prisma.admin.findUnique({
    where: { userId: session.user.id },
    select: { id: true, isSuperAdmin: true },
  });
  if (!admin) {
    throw new Error("Forbidden: Admin privileges required.");
  }
  return session;
};

export const superAdminAuthRequired = async (
  options: AdminAuthRequiredOptions = {},
): Promise<Awaited<ReturnType<typeof getServerSession>>> => {
  const { verified = false } = options;
  const session = await getServerSession();
  if (!session || !session.user) {
    throw new Error("Unauthorized: user authentication required.");
  }
  if (verified && !session.user.emailVerified) {
    throw new Error("Forbidden: Email is not verified.");
  }

  const admin = await prisma.admin.findUnique({
    where: { userId: session.user.id },
    select: { id: true, isSuperAdmin: true },
  });
  if (!admin) {
    throw new Error("Forbidden: Admin privileges required.");
  }
  if (!admin.isSuperAdmin) {
    throw new Error("Forbidden: Super admin privileges required.");
  }
  return session;
};
