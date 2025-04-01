"use client";

import { useEffect, useState } from "react";
import {
    FiTrash2,
    FiChevronDown,
    FiChevronUp,
    FiMessageCircle,
} from "react-icons/fi";
import BouttonElement from "@/components/elements/BouttonElement";

// ✅ Notification toast
const notify = (message, type = "success") => {
    const color =
        type === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800";

    const toast = document.createElement("div");
    toast.className = `fixed top-5 right-5 z-50 px-4 py-2 rounded-xl shadow-lg text-sm font-medium ${color} animate-fadeIn`;
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("opacity-0");
        setTimeout(() => document.body.removeChild(toast), 500);
    }, 2500);
};

export default function AdminArticles() {
    const [articles, setArticles] = useState([]);
    const [comments, setComments] = useState({});
    const [visibleComments, setVisibleComments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await fetch(`/api/articles?search=${search}`);
                if (!res.ok) throw new Error("Erreur récupération articles");
                const data = await res.json();
                setArticles(data.articles);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [search]);

    const fetchCommentsForArticle = async (articleId) => {
        const isVisible = visibleComments[articleId];

        if (isVisible) {
            setVisibleComments((prev) => ({ ...prev, [articleId]: false }));
            return;
        }

        try {
            const res = await fetch(`/api/admin/comments?articleId=${articleId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erreur");
            setComments((prev) => ({ ...prev, [articleId]: data.comments || [] }));
            setVisibleComments((prev) => ({ ...prev, [articleId]: true }));
        } catch (err) {
            console.error("Erreur chargement commentaires:", err);
        }
    };

    const handleDeleteArticle = async (articleId) => {
        if (!confirm("Confirmer la suppression de l'article ?")) return;

        try {
            const res = await fetch("/api/admin/articles", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: articleId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erreur suppression article");
            setArticles((prev) => prev.filter((a) => a.id !== articleId));
            const newComments = { ...comments };
            delete newComments[articleId];
            setComments(newComments);
            notify("Article supprimé avec succès ✅");
        } catch (err) {
            console.error("Suppression article échouée:", err);
            notify("Erreur lors de la suppression ❌", "error");
        }
    };

    const handleDeleteComment = async (commentId, articleId) => {
        if (!confirm("Supprimer ce commentaire ?")) return;

        try {
            const res = await fetch("/api/admin/comments", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commentId, articleId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Erreur suppression commentaire");
            const updated = comments[articleId].filter((c) => c.id !== commentId);
            setComments((prev) => ({ ...prev, [articleId]: updated }));
            notify("Commentaire supprimé 💬");
        } catch (err) {
            console.error("Erreur suppression commentaire:", err);
            notify("Erreur lors de la suppression du commentaire ❌", "error");
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto bg-green-50 min-h-screen rounded-xl">
            <h1 className="text-3xl font-bold mb-6 text-green-700">
                GreenLagg Admin · Articles
            </h1>

            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Rechercher un article..."
                className="w-full px-4 py-3 border border-green-300 rounded-xl mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />

            {loading ? (
                <p className="text-center text-green-700">Chargement...</p>
            ) : error ? (
                <p className="text-center text-red-500">Erreur : {error}</p>
            ) : articles.length === 0 ? (
                <p className="text-center text-green-600">Aucun article trouvé.</p>
            ) : (
                articles.map((article) => (
                    <div
                        key={article.id}
                        className="bg-white border border-green-200 shadow rounded-2xl p-5 mb-8 transition hover:shadow-md"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h2 className="text-xl font-semibold text-green-800">
                                    {article.title}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    👤 Auteur : {article.authorId}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fetchCommentsForArticle(article.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-white font-medium text-sm transition ${
                                        visibleComments[article.id]
                                            ? "bg-green-700 hover:bg-green-800"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    {visibleComments[article.id] ? (
                                        <FiChevronUp className="w-4 h-4" />
                                    ) : (
                                        <FiMessageCircle className="w-4 h-4" />
                                    )}
                                    {visibleComments[article.id] ? "Masquer" : "Commentaires"}
                                </button>

                                <button
                                    onClick={() => handleDeleteArticle(article.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium"
                                >
                                    <FiTrash2 className="w-4 h-4" />
                                    Supprimer
                                </button>
                            </div>
                        </div>

                        {visibleComments[article.id] && (
                            <div className="mt-4">
                                <h3 className="text-green-700 font-semibold mb-2">
                                    💬 Commentaires
                                </h3>
                                {comments[article.id]?.length > 0 ? (
                                    <ul className="space-y-2">
                                        {comments[article.id].map((comment) => (
                                            <li
                                                key={comment.id}
                                                className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 flex justify-between items-center"
                                            >
                                                <div>
                                                    <p className="text-sm text-gray-800">
                                                        {comment.content}
                                                    </p>
                                                    <p className="text-xs text-green-500">
                                                        👤 {comment.username || "Utilisateur inconnu"}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id, article.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        Aucun commentaire.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* Styles toast */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease forwards;
                    transition: opacity 0.5s ease;
                }
            `}</style>
        </div>
    );
}
