import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, slug, shortDesc, content, authorId, tags, isPublished, seoTitle, seoDesc } = body;

        // Vérification des champs obligatoires
        if (!title || !slug || !shortDesc || !content || !tags) {
            return NextResponse.json({ message: "Tous les champs obligatoires doivent être remplis" }, { status: 400 });
        }

        // Nettoyage et séparation des tags (au cas où il y a plusieurs tags séparés par des virgules)
        const cleanedTags = tags.split(",").map((tag: string) => tag.trim());

        // Vérification que les tags ne sont pas vides
        if (cleanedTags.length === 0) {
            return NextResponse.json({ message: "Les tags ne peuvent pas être vides" }, { status: 400 });
        }

        // Création de l'article dans la base de données
        const newArticle = await prisma.article.create({
            data: {
                title,
                slug,
                shortDesc,
                content,
                authorId,
                tags: cleanedTags, // Tags nettoyés
                isPublished,
                seoTitle,
                seoDesc,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        // Retourner la réponse avec le nouvel article créé
        return NextResponse.json(newArticle, { status: 201 });

    } catch (error) {
        console.error("Erreur lors de la création de l'article:", error); // Affiche l'erreur dans la console pour faciliter le débogage
        return NextResponse.json({ message: "Erreur lors de la création de l'article", error: error instanceof Error ? error.message : error }, { status: 500 });
    }
}
