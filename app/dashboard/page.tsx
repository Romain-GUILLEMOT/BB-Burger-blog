"use client";

import { useState, useEffect } from "react";
import BoutonElement from "@/components/elements/BoutonElement";

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
    const [messageType, setMessageType] = useState(""); // "success" ou "error"
    const [isLoading, setIsLoading] = useState(false); // Pour gérer le chargement du formulaire

    // Récupérer les données de l'utilisateur
    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch("/api/dashboard"); // Assurez-vous que l'URL est correcte ici
                const data = await response.json();
                setUser({
                    username: data.username || "",
                    email: data.email || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    password: "", // Ne pas afficher le mot de passe
                    confirmPassword: "", // Champ pour confirmer le mot de passe
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

        // Log pour vérifier si la fonction est appelée
        console.log("Formulaire soumis");

        // Vérification des mots de passe
        if (user.password !== user.confirmPassword) {
            console.log("Les mots de passe ne correspondent pas.");
            setMessage("Les mots de passe ne correspondent pas.");
            setMessageType("error");
            return;
        }

        setIsLoading(true);
        console.log("Données envoyées", user); // Vérification que les données sont bien envoyées

        try {
            const response = await fetch("/api/dashboard", {
                method: "POST", // Utilise POST ici, car nous envoyons les données d'utilisateur pour les mettre à jour
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            // Log pour vérifier la réponse de la requête
            console.log("Réponse serveur:", response);

            if (response.ok) {
                const updatedUser = await response.json();
                setMessage("Utilisateur mis à jour avec succès !");
                setMessageType("success");
                setUser(updatedUser); // Mettre à jour les données avec celles qui ont été modifiées
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
            setIsLoading(false); // Fin du chargement
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10">
            <h2 className="text-2xl font-semibold mb-6 text-green-700">Dashboard Utilisateur</h2>
            <div className="bg-green-100 p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-green-700 font-medium">Nom d'utilisateur</label>
                        <input
                            name="username"
                            value={user.username || ""}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 bg-green-50 border border-green-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-green-700 font-medium">Prénom</label>
                        <input
                            name="first_name"
                            value={user.first_name || ""}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 bg-green-50 border border-green-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-green-700 font-medium">Nom</label>
                        <input
                            name="last_name"
                            value={user.last_name || ""}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 bg-green-50 border border-green-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-green-700 font-medium">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={user.email || ""}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 bg-green-50 border border-green-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-green-700 font-medium">Nouveau mot de passe</label>
                        <input
                            name="password"
                            type="password"
                            value={user.password || ""}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 bg-green-50 border border-green-300 rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-green-700 font-medium">Confirmer le mot de passe</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={user.confirmPassword || ""}
                            onChange={handleChange}
                            className="w-full p-2 mt-1 bg-green-50 border border-green-300 rounded"
                        />
                    </div>
                    <BoutonElement
                        type="submit"
                        className="w-full bg-green-800 hover:bg-green-900 text-white p-2 rounded-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? "Chargement..." : "Mettre à jour"}
                    </BoutonElement>
                </form>

                {message && (
                    <div
                        className={`mt-4 p-4 text-center rounded-lg ${
                            messageType === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                        }`}
                    >
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
