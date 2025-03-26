"use client";

import useSWR, { mutate } from "swr";
import { kyFetcher } from "@/lib/fetcher";
import { useParams } from "next/navigation";
import parse from "html-react-parser";
import Loading from "@/components/elements/Loading";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ky from "ky";

export default function ArticleDetailPage() {
    const { id } = useParams();
    const { data, error, isLoading, mutate } = useSWR(`/api/articles/${id}`, kyFetcher);
    const { data: session } = useSession();
    const [commentContent, setCommentContent] = useState("");
    const [parentId, setParentId] = useState<string | null>(null);
    const [alert, setAlert] = useState("");

    if (isLoading)
        return (
            <div className=" justify-center items-center min-h-[60vh]">
                <p className="text-center mx-auto my-auto text-green-600 text-lg animate-pulse">Chargement de l'article...</p>
                <Loading/>
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-red-600">Erreur : {error.message}</p>
            </div>
        );

    if (!data) return <p className="text-center text-gray-600">Aucun article trouvé.</p>;
    console.log(data)
    return (
        <>
        <main className="px-4 sm:px-6 md:px-8 lg:px-10 m-2 mt-6 mx-auto">
            {/* Article */}
            <article>
                <h1 className="text-4xl font-extrabold text-green-700 mb-2">{data.title}</h1>
                <p className="text-green-500 text-sm italic mb-2">Publié le {new Date(data.publishedAt).toLocaleDateString()}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {data.tags.slice(0, 3).map((tag: string, i: number) => (
                        <span
                            key={i}
                            className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-full"
                        >
      #{tag}
    </span>
                    ))}
                </div>
                <div
                    className="ql light-content bg-green-50 rounded-xl p-2 prose prose-green max-w-none mb-10"

                >{parse(data.content)}</div>
            </article>

            {/* Commentaires */}
            <section>
                <h2 className="text-2xl font-bold text-green-700 mb-4">Commentaires</h2>
                {data.comments?.length === 0 && (
                    <p className="text-gray-600 italic">Aucun commentaire pour l'instant.</p>
                )}
                <ul className="space-y-6 ">
                    {data.comments && (Array.isArray(data.comments)) && data.comments?.map((comment, idx) => (
                        <li key={idx} className="border border-green-100 rounded-md p-4 bg-green-50">
                            <p className="text-gray-800">{comment.content}</p>
                            <div className="mt-2 text-sm text-gray-500">
                                Posté le {new Date(comment.createdAt.$date).toLocaleString()}
                            </div>
                            <div className="mt-3 flex gap-4 text-green-700 text-sm">
                                <button className="hover:text-green-900">❤️ Liker</button>
                                <button
                                    className="hover:text-green-900"
                                    onClick={() => setParentId(comment.createdAt.$date)}
                                >
                                    ↩ Répondre
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Ajouter un commentaire */}
            <div className="mt-10">
                <h3 className="text-xl font-semibold text-green-700 mb-2">Ajouter un commentaire</h3>
                {!session?.user?.id ? (
                    <p className="text-red-600">
                        Vous devez <Link href="/auth/signin" className="underline text-green-700">vous connecter</Link> pour commenter.
                    </p>
                ) : (
                    <form
                        className="space-y-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!commentContent.trim()) return;

                            try {
                                await ky.post(`/api/articles/${id}/comments`, {
                                    json: {
                                        content: commentContent,
                                        parent: parentId,
                                    },
                                });

                                setCommentContent("");
                                setParentId(null);
                                setAlert("");
                                mutate(); // rechargement via SWR
                            } catch (err: any) {
                                const message = await err.response?.json();
                                setAlert(message?.message || "Erreur lors de l'envoi du commentaire");
                            }
                        }}
                    >
                        <textarea
                            placeholder="Votre commentaire..."
                            className="w-full border border-green-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows={4}
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                        />
                        {alert && <p className="text-red-600">{alert}</p>}
                        <button
                            type="submit"
                            className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-md"
                        >
                            Publier
                        </button>
                    </form>
                )}
            </div>
        </main>
        </>
    );
}