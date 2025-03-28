"use client";
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import BouttonElement from "@/components/elements/BouttonElement";

type Article = {
    id: string;
    title: string;
    shortDesc: string;
    imageBase64?: string;
    publishedAt: string;
    slug: string;
};

export default function Articles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState<number>(3);

    const fetchArticles = async () => {
        try {
            const res = await fetch("/api/articles");
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.articles)) {
                    setArticles(data.articles);
                } else {
                    throw new Error("Les données ne contiennent pas de tableau d'articles.");
                }
            } else {
                throw new Error("Erreur lors du chargement des articles");
            }
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    if (loading) {
        return (
            <div className="bg-white py-24 sm:py-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white py-24 sm:py-32 text-center">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="text-xl font-semibold text-red-600">
                        Erreur : {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        Avec <span className="text-green-600">GreenLag</span>, le changement c'est maintenant
                    </h2>
                    <p className="mt-2 text-lg text-gray-600">
                        Découvrez nos derniers articles et actus sur l'environnement
                    </p>
                </div>
                <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {articles.slice(0, visibleCount).map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>

                {visibleCount < Math.min(9, articles.length) && (
                    <div className="mt-12 flex justify-center">
                        <BouttonElement
                            type="secondary"
                            rounded="full"
                            size="md"
                            onClick={() => setVisibleCount((prev) => Math.min(prev + 3, 9))}
                        >
                            Voir plus
                        </BouttonElement>
                    </div>
                )}
            </div>
        </div>
    );
}

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <a href={`/articles/${article.slug}`} className="group">
            <article className="relative isolate flex flex-col justify-end overflow-hidden rounded-lg bg-gray-900 px-8 pb-8 pt-[60%] sm:pt-[50%] lg:pt-[60%] shadow-lg transition duration-300 hover:scale-[1.02] hover:shadow-xl hover:ring-2 hover:ring-green-500">
                <Image
                    src={article.imageBase64 || "/default-image.jpg"}
                    alt={`Image de ${article.title}`}
                    fill
                    className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 -z-[5] bg-gradient-to-t from-gray-900 via-gray-900/40" />
                <time dateTime={article.publishedAt} className="text-sm text-gray-400 mb-[5px]">
                    {formatDate(article.publishedAt)}
                </time>
                <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
                    {article.title}
                </h3>
                <p className="mt-[5px] text-sm text-gray-300 line-clamp-[2]">{article.shortDesc}</p>
            </article>
        </a>
    );
};
