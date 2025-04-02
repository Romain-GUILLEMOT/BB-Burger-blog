// api/admin/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import authOptions, {auth} from "@/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    // Vérification de la session et du rôle ADMIN
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ message: "Non autorisé" }, { status: 403 });
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                createdAt: true,
            },
        });

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
