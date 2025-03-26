"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminStats() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [stats, setStats] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) throw new Error("Aucun ID utilisateur trouvé");

                const response = await fetch("/api/stats/user", {
                    method: "GET",
                    headers: { "x-user-id": userId },
                });

                if (!response.ok) throw new Error("Erreur lors de la récupération du rôle");

                const data = await response.json();
                console.log("User role data:", data); // Debugging

                if (data.role === "ADMIN") {
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
    }, [router]);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/stats");
            if (!response.ok) throw new Error("Erreur lors du chargement des stats");

            const data = await response.json();
            console.log("Stats reçues :", data); // Debugging
            setStats(data.stats); // ✅ Assure-toi que ça récupère bien `10`
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("isAdmin:", isAdmin);
        console.log("Stats actuelles:", stats);
    }, [isAdmin, stats]);

    if (loading) return <p className="text-center text-gray-600">Chargement des statistiques...</p>;
    if (error) return <p className="text-center text-red-600">❌ Erreur : {error}</p>;

    return (
        <div className="min-h-screen p-8 bg-gray-100 text-gray-800">
            <h1 className="text-4xl font-bold text-center mb-8">📊 Statistiques du site</h1>

            {isAdmin && stats !== null ? (
                <>
                    <p className="text-center text-xl font-semibold mb-4">📊 Valeur des stats : {stats}</p>

                    <button
                        onClick={fetchStats}
                        className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        🔄 Rafraîchir les stats
                    </button>
                </>
            ) : (
                <p className="text-center text-gray-600">Vérification des permissions...</p>
            )}
        </div>
    );
}
