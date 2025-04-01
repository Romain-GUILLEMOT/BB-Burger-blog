// lib/auth.ts
import {prisma} from "@/lib/db";
import NextAuth from "next-auth"
import authConfig from "@/auth.config";
import {PrismaAdapter} from "@auth/prisma-adapter";
// Initialise Prisma
interface CustomToken {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    picture?: string | null;
}

// Configuration NextAuth
export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    ...authConfig,
});

