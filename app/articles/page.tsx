"use client";

import React, { useState, useEffect, useCallback } from "react";
import BouttonElement from "@/components/elements/BouttonElement";
import { kyFetcher } from "@/lib/fetcher";
import Loading from "@/components/elements/Loading";
import debounce from "debounce";

export default function ArticleList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 9;

    const [articles, setArticles] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleSearch = useCallback(
        debounce((value: string) => {
            setPage(1);
            setSearchTerm(value.trim());
        }, 500),
        []
    );

    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDebouncedSearch(val);
        handleSearch(val);
    };

    const fetchArticles = async (pageToFetch: number, currentSearch: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await kyFetcher(
                `/api/articles?search=${encodeURIComponent(
                    currentSearch
                )}&page=${pageToFetch}&limit=${limit}`
            );
            if (pageToFetch === 1) {
                setArticles(data.articles);
            } else {
                setArticles((prev) => [...prev, ...data.articles]);
            }
            setTotal(data.total);
        } catch (err: any) {
            console.error(err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(page, searchTerm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchTerm]);

    const handleVoirPlus = () => {
        setPage((prev) => prev + 1);
    };

    const canLoadMore = articles.length < total;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 bg-green-50 min-h-screen">
            {/* Titre */}
            <h1 className="text-3xl font-bold text-green-700 text-center mb-8">
                🌿 Tous les articles
            </h1>

            {/* Recherche */}
            <div className="max-w-md mx-auto mb-8">
                <input
                    type="text"
                    placeholder="🔍 Rechercher un article..."
                    className="w-full border border-green-300 rounded-full px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                    value={debouncedSearch}
                    onChange={onChangeSearch}
                />
            </div>

            {/* Erreur */}
            {error && (
                <p className="text-center text-red-600 font-medium mb-4">
                    Erreur de chargement des articles.
                </p>
            )}

            {/* Liste d’articles */}
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article: any) => (
                    <a
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        className="group bg-white border border-green-200 rounded-2xl overflow-hidden shadow-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        {article.imageBase64 && (
                            <img
                                src={article.imageBase64}
                                alt={article.title}
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        )}
                        <div className="p-5">
                            <h2 className="text-lg font-semibold text-green-800 mb-2 line-clamp-2">
                                {article.title}
                            </h2>
                            <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                                {article.shortDesc}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {article.tags?.slice(0, 3).map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                                    >
                    #{tag}
                  </span>
                                ))}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Chargement */}
            {loading && (
                <div className="flex justify-center mt-8">
                    <Loading />
                </div>
            )}

            {/* Voir plus */}
            <div className="flex justify-center mt-10">
                {canLoadMore && !loading && (
                    <BouttonElement
                        onClick={handleVoirPlus}
                        className="px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold shadow-sm transition"
                    >
                        Voir plus d’articles
                    </BouttonElement>
                )}
            </div>
        </div>
    );
}
