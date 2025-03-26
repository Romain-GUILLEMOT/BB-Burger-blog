// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import verifyAuthenticationResponse from "@passwordless-id/webauthn";

// Initialise Prisma
const prisma = new PrismaClient();
interface CustomToken {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    picture?: string | null;
}

// Configuration NextAuth
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        // Google OAuth
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        // GitHub O Auth
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        // Credentials (email/password)
        CredentialsProvider({
            name: "Email & Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" },
            },
            async authorize(credentials) {
                const schema = z.object({
                    email: z.string().email(),
                    password: z.string().min(6),
                });
                const { email, password } = schema.parse(credentials);

                // Recherche de l'utilisateur dans la BDD
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user || !user.password) throw new Error("Utilisateur non trouvé");

                // Vérification du mot de passe
                const valid = await bcrypt.compare(password, user.password);
                if (!valid) throw new Error("Mot de passe incorrect");

                return { id: user.id, name: user.username, email: user.email, role: user.role };
            },
        }),
        // Passkeys (WebAuthn)
        CredentialsProvider({
            id: "passkeys",
            name: "Passkeys",
            credentials: {
                challenge: { label: "Challenge", type: "text" },
                credential: { label: "Credential", type: "text" },
            },
            async authorize(credentials) {
                const { challenge, credential } = JSON.parse(credentials.challenge);

                const user = await prisma.user.findFirst({ where: { passkey: { not: null } } });
                if (!user) throw new Error("Utilisateur non trouvé");

                // Vérification de la réponse WebAuthn
                const verification = await verifyAuthenticationResponse({
                    credential: JSON.parse(credential),
                    expectedChallenge: challenge,
                    expectedOrigin: process.env.NEXTAUTH_URL!,
                    expectedRPID: new URL(process.env.NEXTAUTH_URL!).hostname,
                    authenticator: user.passkey,
                });

                if (!verification.verified) throw new Error("Passkey invalide");

                return { id: user.id, name: user.username, email: user.email, role: user.role };
            },
        }),
    ],
    callbacks: {
        // On ajoute l'ID de l'utilisateur au token JWT
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;

            }
            return token;
        },

        async session({ session, token }: { session: any; token: CustomToken }) {
            if (session.user && token.id) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },

    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
};

export default authOptions;