"use client";

import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import ky from "ky";
import {useEffect, useState} from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Loading from "@/components/elements/Loading";
import {XCircleIcon} from "@heroicons/react/24/solid";
export default function Register() {
    const [errorMessage, setErrorMessage] = useState("");
    const [formErrors, setFormErrors] = useState<zodErrorsFormat | null>();
    // Validation avec Yup
    const [showErrorCross, setShowErrorCross] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const doom = new Audio("https://assets.romain-guillemot.dev/doom.mp3");
    const buzz = new Audio("https://assets.romain-guillemot.dev/buzz.mp3");
    const success = new Audio("https://assets.romain-guillemot.dev/success.mp3");

    const [imgsrc, setLogosrc] = useState<string>("https://assets.romain-guillemot.dev/greenlaglogolong.webp");

    const [videosrc, setVideosrc] = useState<string>("https://assets.romain-guillemot.dev/bgvideogreenlag.mp4");
    const validationSchema = z
        .object({
            username: z.string().min(3, "Le nom d'utilisateur doit avoir au moins 3 caractères"),
            email: z.string().email("Email invalide"),
            password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
            confirmPassword: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
            first_name: z.string().min(1, "Champ requis"),
            last_name: z.string().min(1, "Champ requis"),
        })
        .superRefine(({ password, confirmPassword }, ctx) => {
            if (password !== confirmPassword) {
                ctx.addIssue({
                    path: ["confirmPassword"],
                    message: "Les mots de passe ne correspondent pas",
                    code: "custom",
                });
            }
        });
    // Gestion du formulaire avec Formik
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            first_name: "",
            last_name: "",
        },
        validateOnChange: false,
        validateOnBlur: false,
        validationSchema: toFormikValidationSchema(validationSchema),
        validate: (values) => {

            try {
                validationSchema.parse(values);
                setFormErrors(null); // Réinitialise les erreurs si la validation réussit
                setVideosrc("https://assets.romain-guillemot.dev/bgvideogreenlag.mp4")
                setLogosrc("https://assets.romain-guillemot.dev/geenlaglogolong.webp");

            } catch (error) {
                if (error instanceof z.ZodError) {

                    const fieldLabels = {
                        username: "Nom d'utilisateur",
                        email: "Adresse e-mail",
                        password: "Mot de passe",
                        confirmPassword: "Confirmation du mot de passe",
                        first_name: "Prénom",
                        last_name: "Nom",
                    };

                    const errorMap = new Map();

                    error.errors.forEach((err) => {
                        const field = err.path[0];
                        const label = fieldLabels[field] || field; // Utilise un label plus lisible si disponible
                        if (!errorMap.has(label)) {
                            errorMap.set(label, new Set());
                        }
                        errorMap.get(label).add(err.message);
                    });

                    const parsedErrors = Array.from(errorMap.entries()).map(([name, messages]) => ({
                        name,
                        message: Array.from(messages).join(" / ") // Fusionne les erreurs pour un même champ
                    }));
                    buzz.play();

                    setTimeout(() => {
                        setShowErrorCross(true);
                    }, 1000);

                    setTimeout(() => {
                        setShowErrorCross(false);
                        setVideosrc("https://assets.romain-guillemot.dev/fire.mp4");
                        setLogosrc("https://assets.romain-guillemot.dev/redlaglogolong.webp");
                        setFormErrors(parsedErrors); // Met à jour le state
                        doom.play();
                    }, 2500);
                }
            }
        },
        onSubmit: async (values) => {
            setErrorMessage(""); // Reset des erreurs avant soumission
            try {
                const response = await ky.post("/api/auth/register", {
                    json: {
                        username: values.username,
                        email: values.email,
                        password: values.password,
                        first_name: values.first_name,
                        last_name: values.last_name,
                    },
                }).json();

                if (response.status === "success") {
                    // Connexion automatique après inscription
                    const signInResponse = await signIn("credentials", {
                        redirect: false,
                        email: values.email,
                        password: values.password,
                    });

                    if (signInResponse?.error) {
                        setErrorMessage("Inscription réussie, mais erreur lors de la connexion.");
                    } else {
                        success.play();
                        setTimeout(() => {
                            success.pause()
                            window.location.href = "/dashboard";
                        }, 2000)
                    }
                } else {
                    buzz.play();

                    setTimeout(() => {
                        setShowErrorCross(true);
                    }, 1000);

                    setTimeout(() => {
                        setShowErrorCross(false);
                        setVideosrc("https://assets.romain-guillemot.dev/fire.mp4");
                        setLogosrc("https://assets.romain-guillemot.dev/redlaglogolong.webp");

                        setErrorMessage(response.message);
                        doom.play();
                    }, 2500);

                }
            } catch (error) {
                buzz.play();

                setTimeout(() => {
                    setShowErrorCross(true);
                }, 1000);

                setTimeout(() => {
                    setShowErrorCross(false);
                    setVideosrc("https://assets.romain-guillemot.dev/fire.mp4");
                    setLogosrc("https://assets.romain-guillemot.dev/redlaglogolong.webp");

                    setErrorMessage("Erreur lors de l'inscription.");
                    doom.play();
                }, 2500);
            }
        },
    });

    useEffect(() => {
        console.log(videosrc);

    }, [videosrc]);
    useEffect(() => {
        const doom = new Audio("https://assets.romain-guillemot.dev/doom.mp3");
        const buzz = new Audio("https://assets.romain-guillemot.dev/buzz.mp3");
        const success = new Audio("https://assets.romain-guillemot.dev/success.mp3");

        let loadedCount = 0;
        const checkIfLoaded = () => {
            loadedCount++;
            if (loadedCount === 3) {
                setIsLoaded(true); // Tous les sons sont chargés, on affiche la page
            }
        };

        doom.addEventListener("canplaythrough", checkIfLoaded, { once: true });
        buzz.addEventListener("canplaythrough", checkIfLoaded, { once: true });
        success.addEventListener("canplaythrough", checkIfLoaded, { once: true });

        doom.load();
        buzz.load();
        success.load();
        return () => {
            doom.removeEventListener("canplaythrough", checkIfLoaded);
            buzz.removeEventListener("canplaythrough", checkIfLoaded);
            success.removeEventListener("canplaythrough", checkIfLoaded);
        };
    }, []);
    if (!isLoaded) {
        return (
            <Loading/>
        );
    }
    return (
        <>
            {showErrorCross && (
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <XCircleIcon className="w-64 h-64 text-red-600 animate-bounce animate-shake" />
                </div>
            )}
            <div className={`flex min-h-screen ${(formErrors || errorMessage) ? "bg-red-900" : "bg-white"}`}>
                {/* Formulaire de connexion */}

                <div className={`flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24`}>
                    <div className={`mx-auto w-full max-w-sm lg:w-96 p-12   ${(formErrors || errorMessage) ? 'animate-shake bg-red-100 border-red-500' : 'bg-slate-100 border-slate-200'} shadow-lg rounded-lg`}>
                    <div>
                            <img
                                alt="Votre Entreprise"
                                src={imgsrc}
                                className="h-1/4 w-auto my-0 mx-auto margin-top-0"
                            />
                            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Créez votre compte</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Déjà membre ?{' '}
                                <a href="/auth/login" className={`font-semibold ${(formErrors || errorMessage) ? 'text-red-700 hover:text-red-900 ' : 'text-green-700 hover:text-green-900 '}`}>
                                    Connectez-vous
                                </a>
                            </p>
                        </div>

                        {errorMessage && (
                            <p className="text-white bg-red-600 p-2 rounded-md text-sm text-center mt-2">
                                {errorMessage}
                            </p>
                        )}
                        {formErrors && (
                            <ul className="bg-red-200 border border-red-500 text-red-800 text-sm p-2 rounded-md mt-2">
                                {formErrors.map((err) => (
                                    <li key={err.name} className="py-1">
                                        🔴 {err.message}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="mt-10">
                            <form onSubmit={formik.handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-900">Nom d'utilisateur</label>
                                    <div className="mt-2">
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            value={formik.values.username}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            required
                                            className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                                                formErrors?.some(e => e.name === "username") ? "border-red-500 outline-red-500" : "outline-gray-300"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-900">Adresse e-mail</label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            required
                                            className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                                                formErrors?.some(e => e.name === "email") ? "border-red-500 outline-red-500" : "outline-gray-300"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-900">Prénom</label>
                                    <div className="mt-2">
                                        <input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            value={formik.values.first_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            required
                                            className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                                                formErrors?.some(e => e.name === "first_name") ? "border-red-500 outline-red-500" : "outline-gray-300"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-900">Nom</label>
                                    <div className="mt-2">
                                        <input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            value={formik.values.last_name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            required
                                            className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                                                formErrors?.some(e => e.name === "last_name") ? "border-red-500 outline-red-500" : "outline-gray-300"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">Mot de passe</label>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            required
                                            className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                                                formErrors?.some(e => e.name === "password") ? "border-red-500 outline-red-500" : "outline-gray-300"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                                        Confirmer le mot de passe
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            required
                                            className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 ${
                                                formErrors?.some(e => e.name === "confirmPassword") ? "border-red-500 outline-red-500" : "outline-gray-300"
                                            }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm ${
                                            formErrors ? "bg-red-700 animate-shake" : "bg-green-800 hover:bg-green-900"
                                        }`}
                                    >
                                        S'inscrire
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Vidéo de fond réintégrée ✅ */}
                <div className="relative hidden w-0 flex-1 lg:block">
                    <video
                        key={videosrc}

                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source
                            src={videosrc}
                            type="video/mp4"
                        />
                    </video>
                </div>
            </div>
        </>
    );
}