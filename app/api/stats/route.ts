import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const stats = await prisma.stats.findFirst();

        if (!stats) {
            return NextResponse.json({ stats: 0 }); // ✅ Valeur par défaut propre
        }

        return NextResponse.json({ stats: stats.views }); // ✅ Récupère le nombre de vues
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la récupération des stats" }, { status: 500 });
    }
}
