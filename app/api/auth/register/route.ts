import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient({
    log: process.env.DEBUG === "true" ? ["query", "info", "warn", "error"] : ["warn", "error"],
});

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    username: z.string().min(3),
    first_name: z.string().min(2),
    last_name: z.string().min(2),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password, username, first_name, last_name } = registerSchema.parse(body);

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ message: 'Utilisateur déjà existant' }, { status: 400 });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        if(process.env.DEBUG === "true") {
            console.log({
                email,
                password: hashedPassword,
                username,
                first_name,
                last_name,
                role: "USER",
                profile: {},
                social: {},
                sso: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            })
        }
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username,
                first_name,
                last_name,
                role: "USER",
                profile: {},
                social: {},
                sso: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({ status: "success", message: 'Utilisateur créé avec succès' }, { status: 201 });
    } catch (error) {
        let data: APIResponse = { status: "error", message: 'Erreur lors de l\'inscription' };

        if (process.env.DEBUG === "true") {

            console.log("🔍 Erreur Prisma :", error);

            data = { status: "error", message: "Erreur détaillée activée en mode debug", error: error };
        }
        return NextResponse.json(data, { status: 500 });
    }
}