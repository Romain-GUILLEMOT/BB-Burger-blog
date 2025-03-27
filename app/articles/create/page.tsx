"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Switch } from "@headlessui/react";
import ButtonElement from "@/components/elements/BouttonElement";
import parse from "html-react-parser";
import { useSession } from "next-auth/react";

// ===== ACE IMPORTS =====
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/theme-xcode";

// ===== Éditeur ACE (chargé dynamiquement) =====
const AceNoSSRWrapper = dynamic(() => import("react-ace"), {
    ssr: false,
});

// ===== Éditeur React Quill (chargé dynamiquement) =====
const QuillNoSSRWrapper = dynamic(() => import("react-quill-new"), {
    ssr: false,
});
import "react-quill-new/dist/quill.core.css";
import "react-quill-new/dist/quill.bubble.css";
import "react-quill-new/dist/quill.snow.css";

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }], // Couleurs
        [{ script: "sub" }, { script: "super" }], // Exposants et indices
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        [{ align: [] }],
        ["link", "image", "video"], // Gestion multimédia
        ["clean"], // Supprimer la mise en forme
    ],
};

const quillFormats = [
    "header", "bold", "italic", "underline", "strike",
    "color", "background", "script",
    "list", "bullet", "indent",
    "blockquote", "code-block",
    "align", "link", "image", "video"
];


export default function CreateArticle() {
    const router = useRouter();

    // ----- Champs formulaire -----
    const [title, setTitle] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoDesc, setSeoDesc] = useState("");
    const [slug, setSlug] = useState("");
    const [imageBase64, setImageBase64] = useState("");

    // ----- État "Publié" (fixé à true) -----
    const [isPublished] = useState(true);

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

    // ----- Convertir l'image en base64 -----
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    setImageBase64(reader.result as string); // Sauvegarder l'image en base64
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // ----- États pour message de succès et d'erreur -----
    const [message, setMessage] = useState<string | null>(null); // Message de feedback (succès/échec)
    const [isError, setIsError] = useState(false); // Indicateur d'erreur

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
                authorId,
                imageBase64,
            }),
        });

        // Vérifier si la soumission a été réussie
        if (res.ok) {
            setMessage("Article publié avec succès!");
            setIsError(false); // Réinitialiser l'état d'erreur
            router.push("/"); // Redirection vers la page d'accueil après succès
        } else {
            setMessage("Erreur lors de la soumission de l'article.");
            setIsError(true); // Indiquer une erreur
        }
    };

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

                {/* Message de succès ou d'erreur */}
                {message && (
                    <div
                        className={`p-4 mb-4 rounded ${
                            isError ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                    >
                        {message}
                    </div>
                )}

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

                            {/* Champ pour l'image */}
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="image-upload"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Cliquez pour ajouter une image</span> ou glissez-déposez
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG (max 800x400px)</p>
                                    </div>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>

                            {/* Affichage de l'aperçu de l'image */}
                            {imageBase64 && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600">Aperçu de l’image :</p>
                                    <img src={imageBase64} alt="Aperçu" className="w-full max-h-40 object-contain border rounded-lg shadow-md" />
                                </div>
                            )}
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
                                        editorProps={{$blockScrolling: true}}
                                    />
                                ) : (
                                    <QuillNoSSRWrapper
                                        theme="snow"
                                        value={content}
                                        onChange={setContent}
                                        className="h-[600px]"
                                        modules={quillModules}
                                        formats={quillFormats}
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
                    <div>
                        <div className="flex flex-col md:flex-row items-center justify-end md:space-x-4 space-y-4 md:space-y-0">
                            {/* Bouton Publier */}
                            <ButtonElement
                                type="success"
                                buttonType="submit"
                                rounded="md"
                                shadow="md"
                                bold
                                title="Publier"
                                className="px-5 py-3"
                            >
                                Publier
                            </ButtonElement>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
