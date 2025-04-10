import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {auth, authOptions} from "@/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await auth();

        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
        }
        const prisma = new PrismaClient();

        const user = await prisma.user.findUnique({
            where: { id: session?.user.id },
        });
        console.log(user)
        const userId = session.user.id;
        const slug = params.id;
        const body = await req.json();
        const { content, parent } = body;

        if (!content || typeof content !== "string" || content.trim() === "") {
            return NextResponse.json({ message: "Contenu vide" }, { status: 400 });
        }

        const article = await prisma.article.findUnique({ where: { slug } });

        if (!article) {
            return NextResponse.json({ message: "Article non trouvé" }, { status: 404 });
        }

        const newComment = {
            userId,
            username: session.user.name,
            content,
            parent: parent || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const existingComments = Array.isArray(article.comments)
            ? article.comments.map((c: any) => ({
                ...c,
                createdAt: c.createdAt || c.created || new Date(),
                updatedAt: c.updatedAt || c.updated || new Date(),
            }))
            : [];

        const updatedComments = [...existingComments, newComment];

        const updatedArticle = await prisma.article.update({
            where: { slug },
            data: { comments: updatedComments },
        });

        return NextResponse.json({status: session.user.username, test : ""}, { status: 201 });
    } catch (error) {
        console.error("Erreur lors de l'ajout du commentaire:", error);
        return NextResponse.json(
            { message: "Erreur serveur", error: error instanceof Error ? error.message : error },
            { status: 500 }
        );
    }
}