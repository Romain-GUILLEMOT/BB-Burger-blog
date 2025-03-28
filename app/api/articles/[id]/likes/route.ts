import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
        }

        const userId = session.user.id;
        const slug = params.id;

        // Récupérer l'article par son slug
        const article = await prisma.article.findUnique({
            where: { slug },
            select: {
                likes: true, // Récupérer uniquement le tableau des likes
                id: true, // Assurez-vous de récupérer l'ID de l'article
            },
        });

        if (!article) {
            return NextResponse.json({ message: "Article non trouvé" }, { status: 404 });
        }

        let likes = article.likes || []; // Assurez-vous que 'likes' est un tableau

        // Vérifier si l'utilisateur a déjà liké l'article
        const alreadyLiked = likes.includes(userId);

        if (alreadyLiked) {
            // Si l'utilisateur a déjà liké, on supprime son like
            const updatedLikes = likes.filter((id) => id !== userId); // Retirer l'ID de l'utilisateur du tableau

            const updatedArticle = await prisma.article.update({
                where: { slug },
                data: {
                    likes: updatedLikes, // Mettre à jour les likes avec le tableau sans l'ID de l'utilisateur
                },
            });

            return NextResponse.json({ likes: updatedArticle.likes.length, liked: false }, { status: 200 });
        } else {
            // Si l'utilisateur n'a pas encore liké, on ajoute son like
            const updatedLikes = [...likes, userId];

            const updatedArticle = await prisma.article.update({
                where: { slug },
                data: {
                    likes: updatedLikes, // Ajouter l'ID de l'utilisateur au tableau des likes
                },
            });

            return NextResponse.json({ likes: updatedArticle.likes.length, liked: true }, { status: 200 });
        }
    } catch (error) {
        console.error("❌ Erreur lors du like/unlike de l'article:", error);
        return NextResponse.json(
            { message: "Erreur serveur", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}

