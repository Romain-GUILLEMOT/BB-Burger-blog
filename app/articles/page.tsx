"use client";

import React, { useState } from "react";
import useSWR from "swr";
import BoutonElement from "@/components/elements/BoutonElement";
import { kyFetcher } from "@/lib/fetcher";
import Loading from "@/components/elements/Loading";

export default function ArticleList() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const limit = 9;

    const { data, error, isLoading } = useSWR(
        `/api/articles?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
        kyFetcher
    );

    const articles = data?.articles || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-green-700 text-center">📰 Articles</h1>

            <div className="mb-6 flex justify-center">
                <input
                    type="text"
                    placeholder="Rechercher un article..."
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-md"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            {/* 🌀 Loading */}
            {isLoading &&  (
                <div className=" justify-center items-center min-h-[60vh]">
                <p className="text-center mx-auto my-auto text-green-600 text-lg animate-pulse">Chargement des l'articles...</p>
                <Loading/>
                </div>
                )}
            {error && <p className="text-center text-red-500">Erreur de chargement.</p>}

            {/* 🗂 Liste des articles */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map((article: any) => {

                    return (
                        <a
                            key={article.id}
                            href={`/articles/${article.slug}`}
                            className="block hover:shadow-lg transition-shadow duration-200 rounded-2xl overflow-hidden bg-white hover:bg-green-50"
                        >
                            <img
                                src={article.imageBase64}
                                alt={article.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 space-y-3">
                                <h2 className="text-xl font-semibold text-green-700">
                                    {article.title}
                                </h2>
                                <p className="text-gray-600 text-sm">{article.shortDesc}</p>
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag: string, i: number) => (
                                        <span
                                            key={i}
                                            className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full"
                                        >
                      #{tag}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>

            {/* ⏭ Pagination */}
            <div className="flex justify-center mt-10 gap-4 items-center">
                <BoutonElement
                    type="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                    ⬅ Précédent
                </BoutonElement>
                <span className="text-green-700 font-medium">
          Page {page} / {totalPages}
        </span>
                <BoutonElement
                    type="secondary"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                >
                    Suivant ➡
                </BoutonElement>
            </div>
        </div>
    );
}
