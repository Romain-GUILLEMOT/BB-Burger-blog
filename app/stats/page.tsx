"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {useSession} from "next-auth/react";
import {getServerSession} from "next-auth";
import authOptions from "@/lib/auth";

export default function AdminStats() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [stats, setStats] = useState<number | null>(null);
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
