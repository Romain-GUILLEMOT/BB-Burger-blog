"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// Définition du type pour les articles
type Article = {
    id: string;
    title: string;
    shortDesc: string;
    imageBase64?: string;
    publishedAt: string;
};

export default function Home() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);  // Ajout de l'état de chargement
    const [error, setError] = useState<string | null>(null);  // Ajout de l'état d'erreur

    // Récupérer les articles depuis l'API
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch("/api/articles");
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data.articles)) {
                        setArticles(data.articles);  // Assure-toi que "articles" est un tableau
                    } else {
                        throw new Error("Les données ne contiennent pas de tableau d'articles.");
                    }
                } else {
                    throw new Error("Erreur lors du chargement des articles");
                }
            } catch (err: any) {
                setError(err.message || "Une erreur est survenue");
            } finally {
                setLoading(false);  // Le chargement se termine ici
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <div className="text-center text-xl font-semibold">Chargement des articles...</div>;
    }

    if (error) {
        return <div className="text-center text-xl font-semibold text-red-600">Erreur : {error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
            {/* Texte principal */}
            <h1 className="text-4xl sm:text-6xl font-bold text-center mb-12">
                Avec <span className="text-green-600">GreenLag</span>, le changement c&apos;est maintenant
            </h1>

            {/* Section Dernières Nouvelles */}
            <section className="w-full max-w-6xl text-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8">
                    Dernières Nouvelles
                </h2>

                {/* Grilles dynamiques des 3 premiers articles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                    {articles.slice(0, 3).map((article) => (
                        <div
                            key={article.id}
                            className="relative group w-full aspect-square bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            <Image
                                src={article.imageBase64 || "/default-image.jpg"} // Image par défaut si aucune image n'est définie
                                alt={`Image de ${article.title}`}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-lg font-semibold">{article.title}</h3>
                                <p className="text-sm mb-4">{article.shortDesc}</p>
                                <a
                                    href={`/articles/${article.id}`}
                                    className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition"
                                >
                                    Voir plus
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grilles des articles restants */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {articles.slice(3).map((article) => (
                        <div
                            key={article.id}
                            className="relative group w-full aspect-square bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            <Image
                                src={article.imageBase64 || "/default-image.jpg"} // Image par défaut si aucune image n'est définie
                                alt={`Image de ${article.title}`}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-lg font-semibold">{article.title}</h3>
                                <p className="text-sm mb-4">{article.shortDesc}</p>
                                <a
                                    href={`/article/${article.id}`}
                                    className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition"
                                >
                                    Voir plus
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
