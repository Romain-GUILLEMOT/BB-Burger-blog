// pages/api/user.ts
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        // Supposons que l'ID de l'utilisateur soit stocké dans localStorage ou un cookie
        const userId = req.headers['x-user-id']; // Exemple : vous pouvez récupérer l'ID utilisateur à partir d'un cookie ou d'un token JWT

        if (!userId) {
            return res.status(400).json({ error: "Utilisateur non authentifié" });
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId as string, // Cherchez l'utilisateur par son ID
                },
            });

            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }

            return res.status(200).json({ role: user.role });
        } catch (error) {
            return res.status(500).json({ error: "Erreur de serveur" });
        }
    } else {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }
}
