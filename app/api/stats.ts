import { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

// Modèle Mongoose pour récupérer les stats
const StatsSchema = new mongoose.Schema({
    id: String,
    title: String,
    views: Number,
    comments: Number,
    likes: Number,
});

const Stats = mongoose.models.Stats || mongoose.model("Stats", StatsSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Méthode non autorisée" });
    }

    try {
        if (!mongoose.connection.readyState) {
            await mongoose.connect(MONGODB_URI);
        }

        const stats = await Stats.find({});

        return res.status(200).json({ stats });
    } catch (error) {
        console.error("Erreur lors de la récupération des stats :", error);
        return res.status(500).json({ error: "Erreur serveur" });
    }
}
