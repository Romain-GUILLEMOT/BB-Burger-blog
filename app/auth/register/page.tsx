"use client";

import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import ky from "ky";
import { useState } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
export default function Register() {
    const [errorMessage, setErrorMessage] = useState("");
    const [formErrors, setFormErrors] = useState<zodErrorsFormat | null>();
    // Validation avec Yup
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
            } catch (error) {
                console.log(error)
                return error.formErrors.fieldErrors;
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
                        window.location.href = "/dashboard"; // Redirection après connexion
                    }
                } else {
                    setErrorMessage(response.message);
                }
            } catch (error) {
                setErrorMessage("Erreur lors de l'inscription.");
            }
        },
    });

    return (
        <>
            <div className="flex min-h-screen">
                {/* Formulaire d'inscription */}
                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96 p-12 bg-white shadow-lg rounded-lg">
                        <div>
                            <img
                                alt="Votre Entreprise"
                                src="https://assets.romain-guillemot.dev/greenlaglogolong.webp"
                                className="h-1/4 w-auto my-0 mx-auto margin-top-0"
                            />
                            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Créez votre compte</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Déjà membre ?{' '}
                                <a href="/auth/login" className="font-semibold text-green-700 hover:text-green-900">
                                    Connectez-vous
                                </a>
                            </p>
                        </div>

                        {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}

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
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300"
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
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300"
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
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300"
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
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300"
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
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300"
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
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-gray-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-green-800 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-900"
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
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source
                            src="https://assets.romain-guillemot.dev/bgvideogreenlag.mp4"
                            type="video/mp4"
                        />
                    </video>
                </div>
            </div>
        </>
    );
}