"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Switch } from "@headlessui/react";
import ButtonElement from "@/components/elements/BoutonElement";
import parse from "html-react-parser";
import { useSession } from "next-auth/react"; // Utilisation du hook useSession pour gérer la session

// ===== ACE IMPORTS =====
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-xcode"; // Thème ACE, remplace si besoin

// ===== Éditeur ACE (chargé dynamiquement) =====
const AceNoSSRWrapper = dynamic(() => import("react-ace"), {
    ssr: false,
});

// ===== Éditeur React Quill (chargé dynamiquement) =====
const QuillNoSSRWrapper = dynamic(() => import("react-quill-new"), {
    ssr: false,
});
import "react-quill-new/dist/quill.snow.css";

export default function CreateArticle() {
    const router = useRouter();

    // ----- Champs formulaire -----
    const [title, setTitle] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [content, setContent] = useState(""); // "Description longue"
    const [tags, setTags] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDesc, setSeoDesc] = useState("");
    const [slug, setSlug] = useState(""); // Nouveau champ slug

    // ----- État "Publié" ou "Brouillon" -----
    const [isPublished, setIsPublished] = useState(false);

    // ----- Basculer entre Ace et Quill -----
    const [useAce, setUseAce] = useState(false);

    // ----- Charger Quill seulement côté client -----
    const [isQuillLoaded, setIsQuillLoaded] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsQuillLoaded(true);
        }
    }, []);

    // ----- Fonction pour générer le slug -----
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/\s+/g, "-") // Remplacer les espaces par des tirets
            .replace(/[^\w-]+/g, ""); // Supprimer les caractères non alphanumériques
    };

    // ----- Mettre à jour le slug chaque fois que le titre change -----
    useEffect(() => {
        if (title.trim()) {
            setSlug(generateSlug(title)); // Mettre à jour le slug quand le titre change
        }
    }, [title]);

    // ----- Gestion de la session -----
    const { data: session } = useSession();
    const authorId = session?.user?.id;

    // ----- Soumission du formulaire -----
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Si l'authorId n'est pas trouvé, on arrête la soumission
        if (!authorId) {
            console.error("Aucun utilisateur connecté.");
            return;
        }

        // Requête POST vers l'API
        const res = await fetch("/api/articles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                shortDesc,
                content,
                tags,
                isPublished,
                seoTitle,
                seoDesc,
                slug,
                authorId, // Utilisation correcte de "authorId"
            }),
        });

        // Vérifier si la soumission a été réussie
        if (res.ok) {
            router.push("/"); // Redirection vers la page d'accueil après succès
        } else {
            console.error("Erreur lors de la soumission de l'article");
        }
    };

    // ----- Gestion de l'affichage du bouton en fonction de l'état -----
    const buttonText = isPublished ? "Enregistrer le brouillon" : "Publier";
    const switchLabel = isPublished ? "Publié" : "Brouillon";

    // ----- Contenu HTML sécurisé pour la Preview -----
    return (
        <div className="min-h-screen bg-green-50 py-10">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-2xl">
                {/* Titre principal et Switch éditeur (ACE/Quill) */}
                <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between mb-8">
                    <h1 className="text-3xl font-extrabold text-green-800 mb-4 md:mb-0">
                        Créer un article
                    </h1>
                    <div className="flex items-center space-x-3 self-end md:self-center">
                        <Switch
                            checked={useAce}
                            onChange={setUseAce}
                            className={`${
                                useAce ? "bg-green-600" : "bg-gray-300"
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                            <span className="sr-only">Basculer éditeur</span>
                            <span
                                className={`${
                                    useAce ? "translate-x-6" : "translate-x-1"
                                } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                            />
                        </Switch>
                        <span className="text-sm text-green-800 font-medium">
              {useAce ? "ACE Editor" : "React Quill"}
            </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* SECTION 1 : Informations générales (2 colonnes sur desktop) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Colonne 1 */}
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="block mb-1 font-semibold text-green-700">
                                    Titre
                                </label>
                                <input
                                    type="text"
                                    placeholder="Titre de l'article"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-3 border rounded bg-green-100 focus:ring-2 focus:ring-green-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-green-700">
                                    Description courte
                                </label>
                                <textarea
                                    placeholder="Un bref résumé de l'article"
                                    value={shortDesc}
                                    onChange={(e) => setShortDesc(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 border rounded bg-green-100 focus:ring-2 focus:ring-green-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-green-700">
                                    Tags (séparés par virgules)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ex: sport, fitness, nutrition"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    className="w-full p-3 border rounded bg-green-100 focus:ring-2 focus:ring-green-400 outline-none"
                                />
                            </div>
                        </div>

                        {/* Colonne 2 */}
                        <div className="flex flex-col space-y-4">
                            <div>
                                <label className="block mb-1 font-semibold text-green-700">
                                    Titre SEO
                                </label>
                                <input
                                    type="text"
                                    placeholder="Titre affiché sur les moteurs de recherche"
                                    value={seoTitle}
                                    onChange={(e) => setSeoTitle(e.target.value)}
                                    className="w-full p-3 border rounded bg-green-100 focus:ring-2 focus:ring-green-400 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 font-semibold text-green-700">
                                    Description SEO
                                </label>
                                <textarea
                                    placeholder="Description pour les moteurs de recherche"
                                    value={seoDesc}
                                    onChange={(e) => setSeoDesc(e.target.value)}
                                    rows={3}
                                    className="w-full p-3 border rounded bg-green-100 focus:ring-2 focus:ring-green-400 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2 : Éditeur (ACE ou Quill) */}
                    <div>
                        <label className="block mb-2 font-semibold text-green-700">
                            Description longue
                        </label>
                        <div className="border border-green-300 rounded">
                            {isQuillLoaded && (
                                useAce ? (
                                    <AceNoSSRWrapper
                                        mode="markdown"
                                        theme="xcode"
                                        name="aceEditor"
                                        width="100%"
                                        height="600px"
                                        value={content}
                                        onChange={(val) => setContent(val)}
                                        editorProps={{ $blockScrolling: true }}
                                    />
                                ) : (
                                    <QuillNoSSRWrapper
                                        theme="snow"
                                        value={content}
                                        onChange={setContent}
                                        className="h-[600px]"
                                    />
                                )
                            )}
                        </div>
                    </div>

                    {/* SECTION 3 : Preview du contenu (sécurisé) */}
                    {content.trim().length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-green-800 mb-2">
                                Aperçu du contenu
                            </h2>
                            <div className="bg-green-50 border border-green-200 rounded p-4 text-gray-800 ql light-content">
                                {parse(content)}
                            </div>
                        </div>
                    )}

                    {/* SECTION 4 : Switch Brouillon / Publié + Bouton de soumission */}
                    <div className="flex flex-col md:flex-row items-center justify-end md:space-x-4 space-y-4 md:space-y-0">
                        {/* Switch Brouillon / Publié */}
                        <div className="flex items-center space-x-3">
                            <Switch
                                checked={isPublished}
                                onChange={setIsPublished}
                                className={`${
                                    isPublished ? "bg-green-600" : "bg-gray-300"
                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                            >
                                <span className="sr-only">Basculer Brouillon / Publié</span>
                                <span
                                    className={`${
                                        isPublished ? "translate-x-6" : "translate-x-1"
                                    } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                                />
                            </Switch>
                            <span className="text-sm text-green-800 font-medium">
                {switchLabel}
              </span>
                        </div>

                        {/* Bouton principal */}
                        <ButtonElement
                            type="info2"
                            buttonType="submit"
                            rounded="md"
                            shadow="md"
                            bold
                            title="Enregistrer les modifications"
                            className="px-5 py-3"
                        >
                            {buttonText}
                        </ButtonElement>
                    </div>
                </form>
            </div>
        </div>
    );
}
