"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ky from "ky";
import Loading from "@/components/elements/Loading";
import createNotification from "@/components/elements/Notification";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
    const { data: session, status } = useSession();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Vérifie si l'utilisateur est un admin
    if (status === "loading") return <Loading />;
    if (session?.user?.role !== "ADMIN") {
        return <p>Vous n'êtes pas autorisé à accéder à cette page.</p>;
    }

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await ky.get("/api/admin/users");
                const data = await response.json();
                setUsers(data);
                setLoading(false);
            } catch (error) {
                createNotification({ type: "error", message: "Erreur lors de la récupération des utilisateurs." });
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Fonction pour changer le rôle d'un utilisateur
    const changeUserRole = async (userId: string, newRole: string) => {
        try {
            const response = await ky.patch(`/api/admin/users/${userId}`, {
                json: { role: newRole },
            });
            if (response.status === 200) {
                const updatedUsers = users.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                );
                setUsers(updatedUsers);
                createNotification({ type: "success", message: "Le rôle de l'utilisateur a été mis à jour." });
            }
        } catch (error) {
            createNotification({ type: "error", message: "Erreur lors de la mise à jour du rôle." });
        }
    };

    // Fonction pour supprimer un utilisateur
    const deleteUser = async (userId: string) => {
        const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
        if (!confirmDelete) return;

        try {
            const response = await ky.delete(`/api/admin/users/${userId}`);
            if (response.status === 200) {
                setUsers(users.filter(user => user.id !== userId));
                createNotification({ type: "success", message: "L'utilisateur a été supprimé." });
            }
        } catch (error) {
            createNotification({ type: "error", message: "Erreur lors de la suppression de l'utilisateur." });
        }
    };

    if (loading) return <Loading />;

    return (
        <main className="p-4">
            <h1 className="text-3xl font-bold mb-6">Gestion des utilisateurs</h1>
            <table className="w-full table-auto border-collapse">
                <thead>
                <tr className="border-b">
                    <th className="px-4 py-2 text-left">Nom</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Rôle</th> {/* Affichage du rôle */}
                    <th className="px-4 py-2 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id} className="border-b">
                        <td className="px-4 py-2">{user.name}</td> {/* Affichage du nom d'utilisateur */}
                        <td className="px-4 py-2">{user.email}</td>
                        <td className="px-4 py-2">
                            <select
                                value={user.role}
                                onChange={(e) => changeUserRole(user.id, e.target.value)}
                                className="px-2 py-1 rounded-md border"
                            >
                                <option value="USER">Utilisateur</option>
                                <option value="AUTHOR">Auteur</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                            <button
                                onClick={() => deleteUser(user.id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </main>
    );
}
