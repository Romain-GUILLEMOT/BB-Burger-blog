"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Chargement dynamique de React Quill pour éviter les problèmes SSR
const QuillNoSSRWrapper = dynamic(() => import("react-quill"), { ssr: false });

import "react-quill/dist/quill.snow.css"; // Styles de Quill

export default function CreateArticle() {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [content, setContent] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [tags, setTags] = useState("");
    const [isPublished, setIsPublished] = useState(false);
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDesc, setSeoDesc] = useState("");
    const [isQuillLoaded, setIsQuillLoaded] = useState(false); // Suivi du chargement de Quill
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsQuillLoaded(true); // Déclenche le chargement de Quill après le montage côté client
        }
    }, []); // Exécution au montage du composant

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("/api/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                slug,
                shortDesc,
                content,
                authorId,
                tags: tags.split(",").map((tag) => tag.trim()),
                isPublished,
                seoTitle,
                seoDesc,
            }),
        });
        if (res.ok) {
            router.push("/"); // Redirige après soumission réussie
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-green-50 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-green-700 mb-4">Créer un article</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Titre"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded bg-green-100 focus:ring-green-500"
                />
                <input
                    type="text"
                    placeholder="Slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-2 border rounded bg-green-100 focus:ring-green-500"
                />
                <textarea
                    placeholder="Description courte"
                    value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)}
                    className="w-full p-2 border rounded bg-green-100 focus:ring-green-500"
                ></textarea>

                {/* Affichage de l'éditeur Quill seulement après son chargement */}
                {isQuillLoaded && (
                    <QuillNoSSRWrapper
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        className="bg-white"
                    />
                )}

                <input
                    type="text"
                    placeholder="ID de l'auteur"
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="w-full p-2 border rounded bg-green-100 focus:ring-green-500"
                />
                <input
                    type="text"
                    placeholder="Tags (séparés par des virgules)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full p-2 border rounded bg-green-100 focus:ring-green-500"
                />
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded"
                    />
                    <label className="text-green-700">Publier</label>
                </div>
                <input
                    type="text"
                    placeholder="Titre SEO"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full p-2 border rounded bg-green-100 focus:ring-green-500"
                />
                <textarea
                    placeholder="Description SEO"
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    className="w-full p-2 border rounded bg-green-100 focus:ring-green-500"
                ></textarea>
                <button
                    type="submit"
                    className="w-full p-2 text-white bg-green-800 rounded hover:bg-green-900"
                >
                    Publier
                </button>
            </form>
        </div>
    );
}
