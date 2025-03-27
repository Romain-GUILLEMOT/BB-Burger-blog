"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

type ArticleStats = {
    id: string;
    title: string;
    views: number;
    comments: number;
    likes: number;
};

export default function AdminStats() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [stats, setStats] = useState<ArticleStats[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session, status } = useSession();

    useEffect(() => {
        const checkUserRole = async () => {
            if (status === "loading") return; // attend que la session soit prête

            try {
                if (session?.user?.role === "ADMIN") {
                    setIsAdmin(true);
                    fetchStats();
                } else {
                    router.push("/"); // 🔴 Redirection si l'utilisateur n'est pas admin
                }
            } catch (err: any) {
                setError("Erreur de vérification du rôle");
                setLoading(false);
            }
        };

        checkUserRole();
    }, [status, session]);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/stats");
            if (!response.ok) throw new Error("Erreur lors du chargement des stats");

            const data = await response.json();
            setStats(data.stats); // ✅ Assure-toi que ça récupère bien les stats
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center text-gray-600">Chargement des statistiques...</p>;
    if (error) return <p className="text-center text-red-600">❌ Erreur : {error}</p>;

    return (
        <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
            <h1 className="text-4xl font-bold text-center mb-8">📊 Statistiques du site</h1>

            {isAdmin && stats.length > 0 ? (
                <>
                    <div className="mb-8">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={stats} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="title" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="views" fill="#8884d8" name="Vues" />
                                <Bar dataKey="comments" fill="#82ca9d" name="Commentaires" />
                                <Bar dataKey="likes" fill="#ffc658" name="Likes" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <button
                        onClick={fetchStats}
                        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        🔄 Rafraîchir les stats
                    </button>
                </>
            ) : (
                <p className="text-center text-gray-600">Aucune statistique disponible...</p>
            )}
        </div>
    );
}
