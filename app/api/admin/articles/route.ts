import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "ID manquant" }, { status: 400 });
        }

        const deleted = await prisma.article.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Article supprimé", article: deleted });
    } catch (error) {
        console.error("Erreur suppression article:", error);
        return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
    }
}
