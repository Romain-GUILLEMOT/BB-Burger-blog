"use client";

import { useState, useEffect } from "react";
import { z } from "zod";  // Importer Zod
import BouttonElement from "@/components/elements/BouttonElement";

// Définir un schéma Zod pour valider le formulaire
const userSchema = z.object({
    username: z.string().min(1, "Le nom d'utilisateur est requis"),
    email: z.string().email("L'email doit être valide"),
    first_name: z.string().min(1, "Le prénom est requis"),
    last_name: z.string().min(1, "Le nom est requis"),
    password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
    confirmPassword: z.string().min(6, "Le mot de passe de confirmation doit avoir au moins 6 caractères"),
});

export default function Dashboard() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch("/api/dashboard");
                const data = await response.json();
                setUser({
                    username: data.username || "",
                    email: data.email || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    password: "",
                    confirmPassword: "",
                });
            } catch (error) {
                console.error("Erreur lors de la récupération des données utilisateur:", error);
            }
        }
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation avec Zod
        const result = userSchema.safeParse(user);
        if (!result.success) {
            // Afficher les erreurs de validation
            setMessage(result.error.errors.map(err => err.message).join(", "));
            setMessageType("error");
            return;
        }

        if (user.password !== user.confirmPassword) {
            setMessage("Les mots de passe ne correspondent pas.");
            setMessageType("error");
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch("/api/dashboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setMessage("Profil mis à jour avec succès !");
                setMessageType("success");
                setUser(updatedUser);
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || "Erreur lors de la mise à jour");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            setMessage("Erreur serveur, veuillez réessayer.");
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-green-800 to-green-400">
                        <h2 className="text-3xl font-extrabold text-white text-center">Tableau de Bord</h2>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                        Nom d'utilisateur
                                    </label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        value={user.username}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                        Prénom
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        id="first_name"
                                        value={user.first_name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                        Nom
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        id="last_name"
                                        value={user.last_name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={user.password}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirmer le mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={user.confirmPassword}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    />
                                </div>
                            </div>
                            <div className="pt-5">
                                <BouttonElement
                                    type="info"
                                    buttonType="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-800 to-green-400 hover:from-green-900 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Mise à jour..." : "Mettre à jour le profil"}
                                </BouttonElement>
                            </div>
                        </form>
                        {message && (
                            <div
                                className={`mt-6 p-4 text-center rounded-lg ${
                                    messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                            >
                                {message}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
