"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import parse from "html-react-parser";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ky from "ky";

export default function ArticleDetailPage() {
    const { id } = useParams();
    const { data, error, isLoading, mutate } = useSWR(`/api/articles/${id}`, (url) =>
        ky.get(url).json()
    );
    const { data: session } = useSession();

    const [commentContent, setCommentContent] = useState("");
    const [parentId, setParentId] = useState<string | null>(null);
    const [likes, setLikes] = useState<number>(0);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        if (data?.likes) {
            setLikes(data.likes.length);
            setHasLiked(data.likes.includes(session?.user?.id));
        }
    }, [data, session]);

    const comments = Array.isArray(data?.comments) ? [...data.comments].reverse() : [];

    const renderComments = (parent: string | null = null): JSX.Element[] => {
        return comments
            .filter((c) => c.parent === parent)
            .map((comment, idx) => {
                const key = comment.createdAt?.$date || comment.createdAt;
                const children = renderComments(key);

                return (
                    <div key={idx} className={`mb-6 ${parent ? "ml-10" : ""}`}>
                        <div className="flex gap-4 items-start">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.username || "Utilisateur")}&background=random&size=40`}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="bg-white border border-green-200 rounded-xl shadow-sm p-4 w-full">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="text-sm font-medium text-green-700">
                                        {comment.username || "Utilisateur"}
                                        <span className="ml-2 text-xs text-gray-400">
                      {new Date(key).toLocaleDateString()}
                    </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{comment.content}</p>
                                <div className="mt-2 flex gap-4 text-xs text-green-500">
                                    <button className="hover:underline" onClick={() => setParentId(key)}>
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
            alert("Connecte-toi pour liker 💚");
            return;
        }

        try {
            const res = await ky.post(`/api/articles/${id}/likes`);
            const result = await res.json();
            if (res.ok) {
                setHasLiked(!hasLiked);
                setLikes(result.likes);
            } else {
                alert(result.message || "Erreur");
            }
        } catch (err) {
            console.error(err);
            alert("Erreur lors du like");
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        try {
            await ky.post(`/api/articles/${id}/comments`, {
                json: { content: commentContent, parent: parentId },
            });
            setCommentContent("");
            setParentId(null);
            mutate();
            alert("Commentaire publié 💬");
        } catch (err: any) {
            const msg = await err.response?.json();
            alert(msg?.message || "Erreur lors de l'envoi");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-green-600">
                <p className="animate-pulse text-lg mb-4">Chargement de l'article...</p>
                <div className="animate-spin w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600 font-medium mt-20">
                Erreur : {error.message}
            </div>
        );
    }

    if (!data) {
        return <p className="text-center text-gray-600">Aucun article trouvé.</p>;
    }

    return (
        <main className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 max-w-4xl mx-auto bg-green-50 min-h-screen rounded-xl">
            <article className="mb-16">
                <h1 className="text-4xl font-extrabold text-green-700 mb-2">{data.title}</h1>
                <p className="text-green-500 text-sm italic mb-3">
                    Publié le {new Date(data.publishedAt).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {data.tags.slice(0, 3).map((tag: string) => (
                        <span
                            key={tag}
                            className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium"
                        >
              #{tag}
            </span>
                    ))}
                </div>
                <div className="prose prose-green max-w-none bg-white rounded-xl p-6 border border-green-200 shadow-sm">
                    {parse(data.content)}
                </div>
            </article>

            {/* LIKE BUTTON MODERNE */}
            <div className="mb-10 flex justify-start items-center gap-4">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 font-semibold text-sm shadow-sm border ${
                        hasLiked
                            ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                            : "bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-700"
                    }`}
                >
          <span
              className={`text-lg transition-transform duration-200 ${
                  hasLiked ? "animate-like text-red-500" : "text-gray-400"
              }`}
          >
            ❤️
          </span>
                    {likes}
                </button>
                <style jsx>{`
          .animate-like {
            animation: pop 0.3s ease-in-out;
          }
          @keyframes pop {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.4);
            }
            100% {
              transform: scale(1);
            }
          }
        `}</style>
            </div>

            {/* COMMENTAIRES */}
            <section className="mt-12">
                <h2 className="text-2xl font-bold text-green-800 mb-6">💬 Commentaires</h2>

                <div className="bg-white border border-green-200 rounded-xl shadow-sm mb-10">
                    {!session?.user?.id ? (
                        <div className="p-4 text-sm text-red-600">
                            Tu dois{" "}
                            <Link href="/auth/login" className="underline text-green-700 hover:text-green-900">
                                te connecter
                            </Link>{" "}
                            pour commenter.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitComment}>
              <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Exprime-toi… on t'écoute 👀"
                  className="w-full p-5 text-base border-none focus:ring-2 focus:ring-green-400 focus:outline-none rounded-t-xl bg-green-50 resize-none min-h-[160px] shadow-inner"
                  rows={6}
              />
                            {parentId && (
                                <div className="px-4 py-2 text-xs text-gray-500 flex justify-between items-center">
                                    En réponse à un commentaire
                                    <button type="button" onClick={() => setParentId(null)} className="text-red-500 underline">
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

                {comments.length > 0 ? (
                    <div className="space-y-6">{renderComments()}</div>
                ) : (
                    <p className="text-sm text-gray-500 italic">Aucun commentaire pour l’instant.</p>
                )}
            </section>
        </main>
    );
}
