import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const slug = params.id;

        const article = await prisma.article.findUnique({
            where: { slug },
        });

        if (!article) {
            return NextResponse.json({ message: "Article non trouvé" }, { status: 404 });
        }

        return NextResponse.json(article, { status: 200 });
    } catch (error) {
        console.error("Erreur lors de la récupération de l'article:", error);
        return NextResponse.json(
            { message: "Erreur serveur", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
