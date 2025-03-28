"use client";

import React, { useState, useEffect, useCallback } from "react";
import BoutonElement from "@/components/elements/BouttonElement";
import { kyFetcher } from "@/lib/fetcher";
import Loading from "@/components/elements/Loading";
import debounce from "debounce";

/**
 * Logique identique, on retire le spin
 * et on prépare une animation "il a peur d'être cliqué"
 * via un fichier CSS séparé. Exemple .article-card:hover { animation: ... }
 */

export default function ArticleList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 9;

    // Liste d’articles, total, chargement et erreurs
    const [articles, setArticles] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Gère la recherche (500 ms de debounce).
     * Réinitialise la page à chaque nouvelle recherche.
     */
    const handleSearch = useCallback(
        debounce((value: string) => {
            setPage(1);
            setSearchTerm(value.trim());
        }, 500),
        []
    );

    /**
     * Met à jour le champ local et déclenche handleSearch.
     */
    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDebouncedSearch(val);
        handleSearch(val);
    };

    /**
     * Récupération des articles via l’API custom.
     * - page=1 => on remplace
     * - sinon => on concatène
     */
    const fetchArticles = async (pageToFetch: number, currentSearch: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await kyFetcher(
                `/api/articles?search=${encodeURIComponent(currentSearch)}&page=${pageToFetch}&limit=${limit}`
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

    /**
     * Recharge à chaque changement de page ou de recherche.
     */
    useEffect(() => {
        fetchArticles(page, searchTerm);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchTerm]);

    const handleVoirPlus = () => {
        setPage((prev) => prev + 1);
    };

    // Tant qu’il reste des articles à charger
    const canLoadMore = articles.length < total;

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 bg-white">
            {/* Titre */}
            <h1 className="text-2xl font-bold text-center mb-8 text-green-700">
                Liste des articles
            </h1>

            {/* Champ de recherche */}
            <div className="max-w-md mx-auto mb-6">
                <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full border border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-md px-4 py-2 outline-none"
                    value={debouncedSearch}
                    onChange={onChangeSearch}
                />
            </div>

            {/* Erreur */}
            {error && (
                <p className="text-center text-red-600 mb-4">
                    Erreur de chargement.
                </p>
            )}

            {/* Liste d’articles */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article: any) => (
                    <a
                        key={article.id}
                        href={`/articles/${article.slug}`}
                        className="article-card group relative block border border-green-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md"
                    >
                        {article.imageBase64 && (
                            <img
                                src={article.imageBase64}
                                alt={article.title}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-4">
                            <h2 className="text-lg font-medium text-green-800 mb-2 line-clamp-2">
                                {article.title}
                            </h2>
                            <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                                {article.shortDesc}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {article.tags?.slice(0, 3).map((tag: string) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs"
                                    >
                    #{tag}
                  </span>
                                ))}
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            {/* Loader */}
            {loading && (
                <div className="flex justify-center mt-4">
                    <Loading />
                </div>
            )}

            {/* Bouton "Voir plus" */}
            <div className="flex justify-center mt-8">
                {canLoadMore && !loading && (
                    <BoutonElement
                        onClick={handleVoirPlus}
                        className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 border border-green-600 transition"
                    >
                        Voir plus
                    </BoutonElement>
                )}
            </div>
        </div>
    );
}
