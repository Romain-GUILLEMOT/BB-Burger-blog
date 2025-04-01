import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const articleId = searchParams.get("articleId");

        if (!articleId) {
            return NextResponse.json({ message: "articleId manquant" }, { status: 400 });
        }

        const article = await prisma.article.findUnique({
            where: { id: articleId },
        });

        if (!article) {
            return NextResponse.json({ message: "Article introuvable" }, { status: 404 });
        }

        return NextResponse.json({ comments: article.comments || [] });
    } catch (error) {
        console.error("Erreur GET commentaires:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { commentId, articleId } = await req.json();

        if (!commentId || !articleId) {
            return NextResponse.json({ message: "commentId ou articleId manquant" }, { status: 400 });
        }

        // Récupération de l'article
        const article = await prisma.article.findUnique({
            where: { id: articleId },
        });

        if (!article || !article.comments) {
            return NextResponse.json({ message: "Article ou commentaires introuvables" }, { status: 404 });
        }

        // Filtrage du commentaire
        const newComments = (article.comments as any[]).filter(
            (comment) => comment.id !== commentId
        );

        // Mise à jour
        await prisma.article.update({
            where: { id: articleId },
            data: {
                comments: newComments,
            },
        });

        return NextResponse.json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
        console.error("Erreur suppression commentaire:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
