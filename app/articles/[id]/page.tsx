"use client";

import useSWR from "swr";
import { kyFetcher } from "@/lib/fetcher";
import { useParams } from "next/navigation";
import parse from "html-react-parser";
import Loading from "@/components/elements/Loading";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ky from "ky";
import createNotification from "@/components/elements/Notification";

export default function ArticleDetailPage() {
    const { id } = useParams();
    const { data, error, isLoading, mutate } = useSWR(`/api/articles/${id}`, kyFetcher);
    const { data: session } = useSession();

    const [commentContent, setCommentContent] = useState("");
    const [parentId, setParentId] = useState<string | null>(null);
    const [alert, setAlert] = useState("");
    const [likes, setLikes] = useState<number>(0);

    // Mettre à jour le nombre de likes lorsque les données sont chargées
    useEffect(() => {
        if (data?.likes) {
            setLikes(data.likes.length); // Compter le nombre d'ID dans le tableau de likes
        }
    }, [data]);

    if (isLoading)
        return (
            <div className="justify-center items-center min-h-[60vh]">
                <p className="text-center mx-auto my-auto text-green-600 text-lg animate-pulse">
                    Chargement de l'article...
                </p>
                <Loading />
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <p className="text-red-600">Erreur : {error.message}</p>
            </div>
        );

    if (!data) return <p className="text-center text-gray-600">Aucun article trouvé.</p>;

    const comments = Array.isArray(data.comments) ? [...data.comments].reverse() : [];
    const renderComments = (parent: string | null = null): JSX.Element[] => {
        return comments
            .filter((c) => c.parent === parent)
            .map((comment, idx) => {
                const key = comment.createdAt?.$date || comment.createdAt;
                const children = renderComments(key);

                return (
                    <div key={idx} className={`${parent ? "ml-12" : ""} mb-6`}>
                        <div className="flex items-start gap-4">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username || "Utilisateur")}&background=random&size=40`}
                                alt={comment.username || "Utilisateur"}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 w-full">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm text-gray-800">{comment.username || "Utilisateur"}</span>
                                        <span className="text-xs text-gray-500">{new Date(key).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-gray-400 text-sm cursor-pointer hover:text-gray-600">⋯</div>
                                </div>
                                <p className="text-gray-700 text-sm mt-2 whitespace-pre-wrap">{comment.content}</p>
                                <div className="mt-3 text-xs text-gray-500 flex gap-4">
                                    <button className="hover:underline">❤️ Liker</button>
                                    <button
                                        onClick={() => setParentId(key)}
                                        className="hover:underline"
                                    >
                                        💬 Répondre
                                    </button>
                                </div>
                            </div>
                        </div>

                        {children.length > 0 && <div className="mt-4">{children}</div>}
                    </div>
                );
            });
    };

    const handleLike = async () => {
        if (!session?.user?.id) {
            createNotification({ type: "warning", message: "Tu dois te connecter pour liker cet article !" });
            return;
        }

        try {
            // Vérifier si l'utilisateur a déjà liké cet article
            const res = await ky.post(`/api/articles/${id}/likes`);
            const json = await res.json();

            if (res.status === 400) {
                createNotification({ type: "warning", message: "Tu as déjà liké cet article !" });
            }
            mutate();
        } catch (err: any) {
            createNotification({ type: "error", message: "Erreur lors du like de l'article" });
        }
    };


    return (
        <main className="px-4 sm:px-6 md:px-8 lg:px-10 m-2 mt-6 mx-auto">
            {/* Article */}
            <article>
                <h1 className="text-4xl font-extrabold text-green-700 mb-2">{data.title}</h1>
                <p className="text-green-500 text-sm italic mb-2">
                    Publié le {new Date(data.publishedAt).toLocaleDateString()}
                </p>
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
                <div className="ql light-content bg-green-50 rounded-xl p-2 prose prose-green max-w-none mb-10">
                    {parse(data.content)}
                </div>
            </article>

            {/* Commentaire - Style moderne type GitHub Discussion */}
            <section className="mt-16 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Discussion</h2>

                {/* Formulaire d'ajout */}
                <div className="mb-10 bg-white border border-green-200 rounded-xl shadow-sm">
                    {!session?.user?.id ? (
                        <div className="p-4 text-sm text-red-600">
                            Tu dois <Link href="/auth/login" className="underline text-green-700 hover:text-green-900">te connecter</Link> pour commenter.
                        </div>
                    ) : (
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!commentContent.trim()) return;
                                try {
                                    await ky.post(`/api/articles/${id}/comments`, {
                                        json: { content: commentContent, parent: parentId },
                                    });
                                    setCommentContent("");
                                    setParentId(null);
                                    setAlert("");
                                    createNotification({ type: "success", message: "C'est fait Bébou!" });
                                    mutate();
                                } catch (err: any) {
                                    const message = await err.response?.json();
                                    createNotification({ type: "error", message: message?.message || "Erreur lors de l'envoi du commentaire" });
                                }
                            }}
                        >
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Exprime-toi… on t'écoute 👀"
                                className="w-full p-4 text-sm border-0 border-b border-green-100 focus:ring-0 rounded-t-xl"
                                rows={4}
                            />
                            {alert && <p className="px-4 pt-1 text-red-500 text-sm">{alert}</p>}
                            {parentId && (
                                <div className="px-4 py-2 text-xs text-gray-500 flex items-center justify-between">
                                    Réponse à un commentaire
                                    <button onClick={() => setParentId(null)} className="underline text-red-500">
                                        Annuler
                                    </button>
                                </div>
                            )}
                            <div className="flex justify-end px-4 py-3 border-t border-green-100">
                                <button
                                    type="submit"
                                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
                                >
                                    Publier
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                {/* Liste des commentaires */}
                <div className="space-y-6">
                    {comments.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">Aucun commentaire pour l’instant.</p>
                    ) : (
                        renderComments()
                    )}
                </div>
            </section>

            {/* Like button */}
            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={handleLike}
                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
                >
                    ❤️ {likes} Likes
                </button>
            </div>
        </main>
    );
}
