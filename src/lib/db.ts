import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";


declare global{
    var prisma : PrismaClient | undefined
}

const globalforPrisma = global as typeof globalThis &{
    prisma ?: PrismaClient
}


export const prisma = globalforPrisma?.prisma || new PrismaClient();



if (process.env.NODE_ENV === "production")
    globalforPrisma.prisma = prisma