"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import useSWR from "swr";
import { kyFetcher } from "@/lib/fetcher";

type ArticleStats = {
    id: string;
    views: number;
    likes: number;
    comments: number;
    createdAt: string; // Date sous forme de string (ex: "2024-03-27T12:00:00.000Z")
};

export default function AdminStats() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const { data: session, status } = useSession();
    const { data: stats, error, isLoading: loading, mutate } = useSWR(`/api/stats`, kyFetcher);

    useEffect(() => {
        const checkUserRole = async () => {
            if (status === "loading") return; // Attend que la session soit prête

            if (session?.user?.role === "ADMIN") {
                setIsAdmin(true);
            } else {
                router.push("/"); // Redirection si l'utilisateur n'est pas admin
            }
        };

        checkUserRole();
    }, [status, session]);

    // Fonction pour formater les dates
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }) + ", " + date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) return <p className="text-center text-gray-600">Chargement des statistiques...</p>;
    if (error) return <p className="text-center text-red-600">❌ Erreur : {error}</p>;

    return (
        <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
            <h1 className="text-4xl font-bold text-center mb-8">📊 Statistiques du site</h1>

            {isAdmin && stats.stats.length > 0 ? (
                <>
                    <div className="mb-8">
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={stats.stats} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="createdAt"
                                    tickFormatter={(value) => formatDate(value)} // Formater la date dans l'axe des X
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(value) => formatDate(value)} // Formater la date dans le tooltip
                                />
                                <Line type="monotone" dataKey="views" stroke="#8884d8" name="Vues" />
                                <Line type="monotone" dataKey="comments" stroke="#82ca9d" name="Commentaires" />
                                <Line type="monotone" dataKey="likes" stroke="#ffc658" name="Likes" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </>
            ) : (
                <p className="text-center text-gray-600">Aucune statistique disponible...</p>
            )}
        </div>
    );
}
