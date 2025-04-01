"use client";

import { useState, useEffect } from "react";
import { z } from "zod";

const userSchema = z.object({
    username: z.string().min(1, "Le nom d'utilisateur est requis"),
    email: z.string().email("L'email doit être valide"),
    first_name: z.string().min(1, "Le prénom est requis"),
    last_name: z.string().min(1, "Le nom est requis"),
    password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
    confirmPassword: z.string().min(6, "Confirmation requise"),
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
                const res = await fetch("/api/dashboard");
                const data = await res.json();
                setUser({
                    username: data.username || "",
                    email: data.email || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    password: "",
                    confirmPassword: "",
                });
            } catch (err) {
                console.error("Erreur chargement user", err);
            }
        }
        fetchUser();
    }, []);

    const handleChange = (e) => {
        setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = userSchema.safeParse(user);

        if (!result.success) {
            setMessage(result.error.errors.map((err) => err.message).join(", "));
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
            const res = await fetch("/api/dashboard", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });

            const result = await res.json();
            if (res.ok) {
                setMessage("Profil mis à jour avec succès 🎉");
                setMessageType("success");
                setUser({ ...user, password: "", confirmPassword: "" });
            } else {
                setMessage(result.error || "Erreur lors de la mise à jour");
                setMessageType("error");
            }
        } catch (err) {
            setMessage("Erreur serveur, réessaie plus tard.");
            setMessageType("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white border border-green-100 shadow-xl rounded-3xl overflow-hidden">
                    <div className="px-6 py-6 bg-gradient-to-r from-green-700 to-green-500">
                        <h2 className="text-3xl font-extrabold text-white text-center">🌿 Mon profil</h2>
                    </div>

                    <div className="px-8 py-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                                {[
                                    { name: "username", label: "Nom d'utilisateur" },
                                    { name: "email", label: "Email", type: "email" },
                                    { name: "first_name", label: "Prénom" },
                                    { name: "last_name", label: "Nom" },
                                    { name: "password", label: "Mot de passe", type: "password" },
                                    { name: "confirmPassword", label: "Confirmation mot de passe", type: "password" },
                                ].map((field) => (
                                    <div key={field.name}>
                                        <label htmlFor={field.name} className="block text-sm font-medium text-green-800 mb-1">
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type || "text"}
                                            name={field.name}
                                            id={field.name}
                                            value={user[field.name]}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-green-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 transition disabled:opacity-50"
                                >
                                    {isLoading ? "Mise à jour..." : "💾 Mettre à jour mon profil"}
                                </button>
                            </div>
                        </form>

                        {message && (
                            <div
                                className={`mt-6 p-4 text-center rounded-xl font-medium ${
                                    messageType === "success"
                                        ? "bg-green-100 text-green-800 border border-green-300"
                                        : "bg-red-100 text-red-700 border border-red-300"
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
