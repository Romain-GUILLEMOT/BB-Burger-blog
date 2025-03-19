"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Utilisation de `useRouter` de `next/navigation`

export default function CreateArticle() {
    const [title, setTitle] = useState<string>("");
    const [slug, setSlug] = useState<string>("");
    const [shortDesc, setShortDesc] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [authorId, setAuthorId] = useState<string>("");
    const [tags, setTags] = useState<string>("");
    const [isPublished, setIsPublished] = useState<boolean>(false);
    const [seoTitle, setSeoTitle] = useState<string>("");
    const [seoDesc, setSeoDesc] = useState<string>("");

    // Remplacer `useRouter` par la version de `next/navigation`
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
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
                tags: tags.split(",").map(tag => tag.trim()),
                isPublished,
                seoTitle,
                seoDesc,
            }),
        });
        if (res.ok) {
            // Utilisation de `router.push()` pour la redirection
            router.push("/"); // Redirige vers la page d'accueil après la soumission
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
                <textarea
                    placeholder="Contenu"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-2 border rounded bg-green-100 focus:ring-green-500"
                ></textarea>
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
