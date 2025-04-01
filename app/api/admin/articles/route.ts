import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";  // Importer ObjectId pour valider et utiliser dans Prisma

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
    try {
        // Récupérer l'ID depuis la requête
        const { id } = await req.json();

        // Vérification de la validité de l'ID avec ObjectId
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "ID invalide" }, { status: 400 });
        }

        // Utilisation de ObjectId pour s'assurer que Prisma le traite correctement
        const article = await prisma.article.delete({
            where: {
                id: new ObjectId(id), // Conversion en ObjectId
            },
        });

        return NextResponse.json({ message: "Article supprimé avec succès", article });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'article:", error);
        return NextResponse.json({ error: "Erreur lors de la suppression de l'article" }, { status: 500 });
    }
}
