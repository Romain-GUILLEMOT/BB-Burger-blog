"use client";

import { useState, useEffect } from "react";
import BouttonElement from "@/components/elements/BouttonElement";
import { FiTrash2 } from "react-icons/fi";

export default function AdminArticles() {
    const [articles, setArticles] = useState<any[]>([]); // Liste des articles
    const [loading, setLoading] = useState(true); // Statut de chargement
    const [error, setError] = useState<string | null>(null); // Gestion des erreurs
    const [page, setPage] = useState(1); // Page actuelle
    const [total, setTotal] = useState(0); // Total des articles
    const [limit] = useState(10); // Limite d'articles par page
    const [search, setSearch] = useState(""); // Recherche

    // Charger les articles avec pagination et recherche
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`/api/articles?page=${page}&limit=${limit}&search=${search}`);
                if (!response.ok) {
                    throw new Error("Erreur de récupération des articles");
                }
                const data = await response.json();
                setArticles(data.articles);
                setTotal(data.total);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchArticles();
    }, [page, limit, search]); // Recharger les articles lorsque la page, la limite ou la recherche change

    // Fonction pour supprimer un article
    const handleDelete = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cet article ?")) return;

        try {
            const response = await fetch(`/api/articles/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Une erreur est survenue lors de la suppression de l'article");
            }

            setArticles((prevArticles) => prevArticles.filter((article) => article.id !== id));
            alert("Article supprimé avec succès");
        } catch (error: any) {
            console.error("Erreur lors de la suppression:", error);
            alert("Une erreur est survenue lors de la suppression de l'article.");
        }
    };




    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    if (loading) {
        return <p>Chargement des articles...</p>;
    }

    if (error) {
        return <p className="text-red-500">Erreur: {error}</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Gestion des Articles</h1>

            {/* Zone de recherche */}
            <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Rechercher des articles..."
                className="p-2 border border-gray-300 rounded mb-4"
            />

            <div className="overflow-x-auto">
                {articles.length > 0 ? (
                    <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">ID</th>
                            <th className="border border-gray-300 px-4 py-2">Titre</th>
                            <th className="border border-gray-300 px-4 py-2">Auteur</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {articles.map((article) => (
                            <tr key={article.id} className="border border-gray-300">
                                <td className="border border-gray-300 px-4 py-2">{article.id}</td>
                                <td className="border border-gray-300 px-4 py-2">{article.title}</td>
                                <td className="border border-gray-300 px-4 py-2">{article.authorId}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <BouttonElement variant="destructive" onClick={() => handleDelete(article.id)}>
                                        <FiTrash2 className="w-4 h-4" />
                                    </BouttonElement>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">Aucun article disponible.</p>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setPage(page > 1 ? page - 1 : page)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Précédent
                </button>
                <span>{`Page ${page} / ${Math.ceil(total / limit)}`}</span>
                <button
                    onClick={() => setPage(page < Math.ceil(total / limit) ? page + 1 : page)}
                    disabled={page === Math.ceil(total / limit)}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}
