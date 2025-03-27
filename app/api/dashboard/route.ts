import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
    const session = await getServerSession(authOptions);
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
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    try {
        const { username, first_name, last_name, email, password } = await req.json();

        // Mise à jour des données utilisateur
        const updatedUser = await prisma.user.update({
            where: { email: session.user?.email || "" },
            data: {
                username,
                first_name,
                last_name,
                email,
                password, // Mettez à jour le mot de passe si fourni
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
