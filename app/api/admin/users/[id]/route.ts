// api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    // Vérification de la session et du rôle ADMIN
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const userId = params.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    // Vérification de la session et du rôle ADMIN
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    const userId = params.id;
    const body = await req.json();

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: body,
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { role } = await req.json();
        if (!role || !['USER', 'AUTHOR', 'ADMIN'].includes(role)) {
            return NextResponse.json({ message: 'Rôle invalide' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: { role },
        });

        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Erreur serveur', error: error.message }, { status: 500 });
    }
}
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const userId = params.id;

        // Vérifiez si l'utilisateur existe avant de le supprimer
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
        }

        // Suppression de l'utilisateur
        await prisma.user.delete({
            where: { id: userId },
        });

        return NextResponse.json({ message: "Utilisateur supprimé avec succès" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erreur serveur", error: error.message }, { status: 500 });
    }
}
