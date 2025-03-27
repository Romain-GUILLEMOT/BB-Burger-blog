"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import HeaderMain from "@/components/elements/header/HeaderMain";

// Définition du type pour les articles
type Article = {
    id: string;
    title: string;
    shortDesc: string;
    imageBase64?: string;
    publishedAt: string;
    slug: string;
};

export default function Home() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fonction pour récupérer les articles depuis l'API
    const fetchArticles = async () => {
        try {
            const res = await fetch("/api/articles");

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.articles)) {
                    setArticles(data.articles); // Mise à jour des articles
                } else {
                    throw new Error("Les données ne contiennent pas de tableau d'articles.");
                }
            } else {
                throw new Error("Erreur lors du chargement des articles");
            }
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
        } finally {
            setLoading(false); // Fin du chargement
        }
    };

    useEffect(() => {
        fetchArticles(); // Appel de la fonction au montage du composant
    }, []);

    // Gestion de l'état de chargement et d'erreur
    if (loading) {
        return (
            <div className="text-center text-xl font-semibold">
                Chargement des articles...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-xl font-semibold text-red-600">
                Erreur : {error}
            </div>
        );
    }

    return (
        <>
        <HeaderMain/>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
            {/* Texte principal */}
            <h1 className="text-4xl sm:text-6xl font-bold text-center mb-12">
                Avec <span className="text-green-600">GreenLag</span>, le changement c&apos;est maintenant
            </h1>

            {/* Section Dernières Nouvelles */}
            <section className="w-full max-w-6xl text-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8">Dernières Nouvelles</h2>

                {/* Grille des 3 premiers articles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                    {articles.slice(0, 3).map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>

                {/* Grille des 3 derniers articles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {articles.slice(3, 6).map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </section>
        </div></>
    );
}

// Composant pour afficher un article
const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    return (
        <a
            href={`/articles/${article.slug}`} // Redirige directement sur clic
            className="relative group w-full aspect-square bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transform transition-transform duration-300 ease-in-out hover:scale-105"
        >
            <Image
                src={article.imageBase64 || "/default-image.jpg"} // Image par défaut
                alt={`Image de ${article.title}`}
                layout="fill"
                objectFit="cover"
                className="transition-all duration-300 group-hover:scale-110" // Agrandissement au survol
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg sm:text-xl font-semibold">{article.title}</h3>
                <p className="text-sm sm:text-base mb-4">{article.shortDesc}</p>
            </div>
        </a>
    );
};
