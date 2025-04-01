"use client";
import { Menu, Transition } from "@headlessui/react";
import {Fragment, useEffect, useState} from "react";
import { signOut, useSession } from "next-auth/react";
import {UserCircleIcon} from "@heroicons/react/24/solid";
import Image from "next/image";

export default function AuthMenu() {
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [isAuthor, setIsAuthor] = useState<boolean>(false)
    const { data: session, status } = useSession();
    const user = session?.user;

    useEffect(() => {
        const checkUserRole = async () => {
            if (status === "loading") return;
            if (session?.user?.role === "ADMIN") {
                setIsAdmin(true);
                setIsAuthor(true);
            }
            if(session?.user?.role === "AUTHOR") {
                setIsAuthor(true);
            }
        };

        checkUserRole();
    }, [status, session]);
    return (
        <div className="hidden md:flex items-center space-x-4">
            {user ? (
                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2 text-white hover:text-yellow-400 font-medium transition-colors duration-200">
                        <Image
                            src={
                                user.image
                                    ? user.image
                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || "UU")}&background=random&color=fff&size=40`
                            }
                            alt="Avatar"
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                            unoptimized // important pour les URLs externes non autorisées dans next.config.js
                            referrerPolicy="no-referrer"
                        />
                        <span>{user.name || "Utilisateur"}</span>
                    </Menu.Button>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="/dashboard"
                                        className={`block px-4 py-2 text-gray-800 ${
                                            active ? "bg-gray-100" : ""
                                        }`}
                                    >
                                        Dashboard
                                    </a>
                                )}
                            </Menu.Item>

                            {isAdmin && (
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/admin"
                                            className={`block px-4 py-2 text-gray-800 ${
                                                active ? "bg-gray-100" : ""
                                            }`}
                                        >
                                            Admin
                                        </a>
                                    )}
                                </Menu.Item>
                            )}
                            {isAuthor && (
                                <Menu.Item>
                                    {({ active }) => (
                                        <a
                                            href="/articles/create"
                                            className={`block px-4 py-2 text-gray-800 ${
                                                active ? "bg-gray-100" : ""
                                            }`}
                                        >
                                            Créer un article
                                        </a>
                                    )}
                                </Menu.Item>
                            )}
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => signOut()}
                                        className={`block w-full text-left px-4 py-2 text-red-600 ${
                                            active ? "bg-gray-100" : ""
                                        }`}
                                    >
                                        Déconnexion
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            ) : (
                <a
                    href="/auth/login"
                    className="flex items-center space-x-2 text-white hover:text-yellow-400 font-medium transition-colors duration-200"
                >
                    <UserCircleIcon className="h-6 w-6" />
                    <span>Connexion / Inscription</span>
                </a>
            )}
        </div>
    );
}