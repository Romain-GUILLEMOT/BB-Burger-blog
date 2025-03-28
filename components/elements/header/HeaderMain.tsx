"use client";
import React from 'react';
import Link from "next/link";

export default function HeaderMain() {
    return (
        <section className="w-full min-h-screen flex flex-col justify-between bg-gradient-to-br from-green-100 via-green-400 to-green-700 px-6 pt-10 pb-8 rounded-b-3xl">
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                    <img src={"https://assets.romain-guillemot.dev/greenlagg/greenlagg_full.webp"} className="h-10 sm:h-12 w-auto" />

                </div>
                <nav className="flex gap-6 text-sm text-black font-medium">
                    <Link href="/">Accueil</Link>
                    <Link href="/articles">Articles</Link>
                    <Link href="/a-propos">À propos</Link>
                </nav>
            </header>

            <div className="text-center max-w-3xl mx-auto">
        <span className="inline-block mb-4 px-4 py-1 bg-white/40 text-sm rounded-full font-medium text-gray-800 shadow-sm backdrop-blur-md">
          Green IT : réduisons notre impact numérique →
        </span>
                <h1 className="text-6xl sm:text-7xl font-bold text-black mb-6">Moins de pollution. Plus de solutions.</h1>
                <p className="text-lg text-gray-700 mb-8">
                    Un blog dédié au numérique responsable : actus, conseils et réflexions pour un monde digital plus durable.
                </p>
                <div className="flex justify-center gap-4">
                    <Link  href={"/articles"}  className="bg-black text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-900 transition">
                        Articles
                    </Link>
                    <Link href={"/a-propos"} className="bg-white border border-gray-300 text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition">
                        A propos
                    </Link>
                </div>
            </div>

            <footer className="mt-16 flex justify-center gap-6 flex-wrap">
                    <img
                        src="https://assets.romain-guillemot.dev/greenlagg/logo/1.png"
                        alt="Ozlaloc"
                        className="h-8"
                    />
                <img
                    src="https://assets.romain-guillemot.dev/greenlagg/logo/2.png"
                    alt="Ozlaloc"
                    className="h-8"
                />
                <img
                    src="https://assets.romain-guillemot.dev/greenlagg/logo/3.png"
                    alt="Ozlaloc"
                    className="h-8"
                />
                <img
                    src="https://assets.romain-guillemot.dev/greenlagg/logo/4.png"
                    alt="Ozlaloc"
                    className="h-8"
                />
                <img
                    src="https://assets.romain-guillemot.dev/greenlagg/logo/5.png"
                    alt="Ozlaloc"
                    className="h-8"
                />
                <img
                    src="https://assets.romain-guillemot.dev/greenlagg/logo/6.png"
                    alt="Ozlaloc"
                    className="h-8"
                />
                <img
                    src="https://assets.romain-guillemot.dev/greenlagg/logo/7.png"
                    alt="Ozlaloc"
                    className="h-8"
                />
                <img
                    src="https://assets.romain-guillemot.dev/greenlagg/logo/8.png"
                    alt="Ozlaloc"
                    className="h-8"
                />
                <img
                    src="https://assets.romain-guillemot.dev/greenlagg/logo/9.png"
                    alt="Ozlaloc"
                    className="h-8"
                />
                <img
                    src="https://assets.romain-guillemot.dev/greenlagg/logo/10.png"
                    alt="Ozlaloc"
                    className="h-8"
                />
            </footer>
        </section>
    );
}
