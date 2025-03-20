import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { signOut, useSession } from "next-auth/react";
import {UserCircleIcon} from "@heroicons/react/24/solid";


export default function AuthMenu() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <div className="hidden md:flex items-center space-x-4">
            {user ? (
                <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2 text-white hover:text-yellow-400 font-medium transition-colors duration-200">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email)}&background=random&color=fff&size=40`}
                            alt="Avatar"
                            className="h-8 w-8 rounded-full"
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

                            {user.role === 2 && (
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