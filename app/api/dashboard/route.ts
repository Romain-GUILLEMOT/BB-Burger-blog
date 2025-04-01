import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs"; // Utilisation de bcryptjs au lieu de bcrypt
import {auth} from "@/auth";

const prisma = new PrismaClient();

export async function GET() {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user?.email || "" },
            select: { username: true, email: true, first_name: true, last_name: true },
        });

        if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

// Méthode POST pour mettre à jour les données de l'utilisateur
export async function POST(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    try {
        const { username, first_name, last_name, email, password } = await req.json();

        // Cryptage du mot de passe si celui-ci est fourni
        let hashedPassword = undefined;
        if (password) {
            const salt = await bcryptjs.genSalt(10); // Générer un salt
            hashedPassword = await bcryptjs.hash(password, salt); // Crypter le mot de passe
        }

        // Mise à jour des données utilisateur
        const updatedUser = await prisma.user.update({
            where: { email: session.user?.email || "" },
            data: {
                username,
                first_name,
                last_name,
                email,
                password: hashedPassword, // Mettre à jour le mot de passe uniquement s'il a été fourni
                updatedAt: new Date(), // Mise à jour de la date de modification
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
