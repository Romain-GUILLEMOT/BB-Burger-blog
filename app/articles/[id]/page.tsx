"use client";

import useSWR from "swr";
import { kyFetcher } from "@/lib/fetcher";
import { useParams } from "next/navigation";
import parse from "html-react-parser";
import Loading from "@/components/elements/Loading";

export default function ArticleDetailPage() {
    const { id } = useParams();
    const { data, error, isLoading } = useSWR(`/api/articles/${id}`, kyFetcher);

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
                <p className="text-green-500 text-sm italic mb-4">Publié le {new Date(data.publishedAt).toLocaleDateString()}</p>

                <div
                    className="ql light-content bg-green-100 rounded-xl p-2 prose prose-green max-w-none mb-10"

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
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Ajouter un commentaire */}
            <div className="mt-10">
                <h3 className="text-xl font-semibold text-green-700 mb-2">Ajouter un commentaire</h3>
                <form className="space-y-4">
                    <textarea
                        placeholder="Votre commentaire..."
                        className="w-full border border-green-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows={4}
                    />
                    <button
                        type="submit"
                        className="bg-green-800 hover:bg-green-900 text-white px-4 py-2 rounded-md"
                    >
                        Publier
                    </button>
                </form>
            </div>
        </main>
        </>
    );
}