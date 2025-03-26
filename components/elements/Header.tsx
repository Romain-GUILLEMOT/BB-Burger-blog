"use client";
import React from 'react';
import { Disclosure } from '@headlessui/react';
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/solid";
import AuthMenu from "@/components/elements/header/AuthMenu";

export default function Header() {
    return (

        <Disclosure as="header" className="bg-green-600 shadow-md rounded-b-[50px]">
            {({ open }) => (
                <>
                    <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
                        <div className="flex justify-between items-center py-4">
                            {/* Logo de la marque */}
                            <a href="/" className="flex-shrink-0">
                                <img className="h-10 sm:h-12" src="https://assets.romain-guillemot.dev/greenlaglogo.webp" alt="GreenLag Logo" />
                            </a>

                            {/* Menu desktop */}
                            <div className="hidden md:flex space-x-8">
                                <a href="/" className="text-white hover:text-yellow-400 font-medium transition-colors duration-200">Accueil</a>
                                <a href="/articles" className="text-white hover:text-yellow-400 font-medium transition-colors duration-200">Articles</a>
                                <a href="/apropos" className="text-white hover:text-yellow-400 font-medium transition-colors duration-200">À propos</a>
                            </div>

                          <AuthMenu/>

                            {/* Bouton mobile avec coins plus arrondis */}
                            <div className="flex md:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-full text-white hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white">
                                    <span className="sr-only">Ouvrir le menu</span>
                                    {open ? (
                                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                        </div>
                    </nav>

                    {/* Menu mobile déroulant */}
                    <Disclosure.Panel className="md:hidden bg-green-700 rounded-b-[50px]">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-green-600 transition-colors duration-200">
                                Accueil
                            </a>
                            <a href="/articles" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-green-600 transition-colors duration-200">
                                Articles
                            </a>
                            <a href="/a-propos" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-green-600 transition-colors duration-200">
                                À propos
                            </a>
                            <a href="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-green-600 transition-colors duration-200">
                                Connexion / Inscription
                            </a>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}