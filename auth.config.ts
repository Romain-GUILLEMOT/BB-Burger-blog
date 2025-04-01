import type { NextAuthConfig } from "next-auth"

import {z} from "zod";
import {prisma} from "@/lib/db";
import bcrypt from "bcryptjs";
import verifyAuthenticationResponse from "@passwordless-id/webauthn";
import Google from "@auth/core/providers/google";
import Credentials from "next-auth/providers/credentials"
import GitHub from "@auth/core/providers/github";
import Osu from "@auth/core/providers/osu";
export default {
    providers: [
        // Google OAuth
        Google,
        GitHub,
        Osu
    ],
    callbacks: {
        session({ session, token }) {
            const returnedSession = {
                id: session.user.id,
                email: session.user.email,
                role: session.user.role,
                image: session.user.image,
                name: session.user.name
            }
            return {...session, user: returnedSession}
        }
    },

    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },


} satisfies NextAuthConfig