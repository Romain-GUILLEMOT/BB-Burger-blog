"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-green-600 text-white py-10 rounded-t-[50px] shadow-md">
            <div className="container mx-auto px-6 grid md:grid-cols-4 gap-8">
                {/* Section À propos */}
                <div>
                    <h2 className="text-xl font-semibold">À propos</h2>
                    <p className="mt-2 text-white">Découvrez nos articles sur le Green IT et l'impact du numérique sur l'environnement.</p>
                </div>

                {/* Section Liens rapides */}
                <div>
                    <h2 className="text-xl font-semibold">Liens rapides</h2>
                    <ul className="mt-2 space-y-2">
                        <li><Link href="/public" className="text-yellow-400 hover:text-white">Accueil</Link></li>
                        <li><Link href="/articles" className="text-yellow-400 hover:text-white">Articles</Link></li>
                        <li><Link href="/contact" className="text-yellow-400 hover:text-white">Contact</Link></li>
                        <li><Link href="/apropos" className="text-yellow-400 hover:text-white">À propos</Link></li>
                    </ul>
                </div>

                {/* Section Contact */}
                <div>
                    <h2 className="text-xl font-semibold">Contact</h2>
                    <p className="mt-2 text-white">Email : contact@greenitblog.com</p>
                    <p className="text-white">Téléphone : +33 1 23 45 67 89</p>
                    <p className="text-white">Adresse : 123 Rue Verte, Paris, France</p>
                </div>

                {/* Section Réseaux sociaux */}
                <div>
                    <h2 className="text-xl font-semibold">Suivez-nous</h2>
                    <div className="flex mt-3 space-x-4">
                        <Link href="#" className="text-yellow-400 hover:text-white text-2xl">
                            <FaFacebook />
                        </Link>
                        <Link href="#" className="text-yellow-400 hover:text-white text-2xl">
                            <FaTwitter />
                        </Link>
                        <Link href="#" className="text-yellow-400 hover:text-white text-2xl">
                            <FaInstagram />
                        </Link>
                        <Link href="#" className="text-yellow-400 hover:text-white text-2xl">
                            <FaLinkedin />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bas de page */}
            <div className="text-center mt-10 border-t border-yellow-400 pt-4 text-white">
                &copy; {new Date().getFullYear()} Green IT Blog | Tous droits réservés
            </div>
        </footer>
    );
};

export default Footer;
