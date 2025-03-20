import React from "react";
import Link from "next/link";

// Composant ArticleElement
const ArticleElement = ({ article }) => {
    return (
        <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p className="text-gray-600 mt-2">{article.description}</p>
            <Link href={"#"}>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    Lire plus
                </button>
            </Link>
        </div>
    );
};

// Page Liste des Articles
const articles = [
    { id: 1, title: "Article 1", description: "Description de l'article 1" },
    { id: 2, title: "Article 2", description: "Description de l'article 2" },
    { id: 3, title: "Article 3", description: "Description de l'article 3" },
];

export default function ArticlesPage() {
    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Liste des Articles</h1>
            <div className="grid gap-4">
                {articles.map((article) => (
                    <ArticleElement key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
}
