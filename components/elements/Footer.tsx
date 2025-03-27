"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-green-700 text-white pt-8 pb-4 px-4 mt-16 rounded-t-[40px] shadow-lg">
            <div className="max-w-md mx-auto text-center">
                <h2 className="text-lg font-bold mb-4">Liens rapides</h2>
                <ul className="grid grid-cols-2 gap-4 text-sm mb-6 justify-center">
                    <li><Link href="/public" className="text-yellow-400 hover:text-white">Accueil</Link></li>
                    <li><Link href="/articles" className="text-yellow-400 hover:text-white">Articles</Link></li>
                    <li><Link href="/contact" className="text-yellow-400 hover:text-white">Contact</Link></li>
                    <li><Link href="/about" className="text-yellow-400 hover:text-white">À propos</Link></li>
                </ul>
            </div>

            <div className="border-t border-yellow-500 pt-4 mt-4 text-center">
                <div className="flex justify-center gap-4 text-lg text-yellow-400 mb-2">
                    <Link href="#" className="hover:text-white"><FaFacebook /></Link>
                    <Link href="#" className="hover:text-white"><FaTwitter /></Link>
                    <Link href="#" className="hover:text-white"><FaInstagram /></Link>
                    <Link href="#" className="hover:text-white"><FaLinkedin /></Link>
                </div>
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Green IT Blog — Tous droits réservés ·{" "}
                    <Link href="/mentions-legales" className="underline text-yellow-300">Mentions légales</Link>
                </p>
            </div>
        </footer>
    );
};

export default Footer;