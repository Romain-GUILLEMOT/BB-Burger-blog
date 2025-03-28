// likes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession();
        if (!session?.user) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
        }

        const userId = session.user.id;
        const slug = params.id;

        // Récupérer l'article par son slug
        const article = await prisma.article.findUnique({
            where: { slug },
        });

        if (!article) {
            return NextResponse.json({ message: "Article non trouvé" }, { status: 404 });
        }

        // Si article.likes est undefined, initialisez-le comme un tableau vide
        let likes = Array.isArray(article.likes) ? article.likes : [];

        // Vérifier si l'utilisateur a déjà liké l'article
        if (likes.includes(userId)) {
            return NextResponse.json({ message: "Déjà liké" }, { status: 400 });
        }

        // Vérifier que l'ID utilisateur est valide
        if (!userId) {
            return NextResponse.json({ message: "Utilisateur non valide" }, { status: 400 });
        }

        // Ajouter l'ID de l'utilisateur au tableau des likes de l'article
        likes = [...likes, userId]; // Ajoute l'ID de l'utilisateur au tableau des likes

        // Filtrer les éventuelles valeurs undefined dans le tableau
        const filteredLikes = likes.filter(Boolean);

        // Ajouter l'ID de l'utilisateur au tableau des likes de l'article
        const updatedArticle = await prisma.article.update({
            where: { slug },
            data: {
                likes: {
                    set: filteredLikes, // Met à jour les likes avec le tableau filtré
                },
            },
        });

        // Retourner le nombre de likes mis à jour
        return NextResponse.json({ likes: updatedArticle.likes.length }, { status: 200 });
    } catch (error) {
        console.error("❌ Erreur lors du like de l'article:", error);
        return NextResponse.json(
            { message: "Erreur serveur", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}
