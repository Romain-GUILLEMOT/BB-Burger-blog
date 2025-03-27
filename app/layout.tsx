"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/tw.css";
import Header from "@/components/elements/Header";
import Footer from "@/components/elements/Footer";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import { usePathname } from "next/navigation"; // Importer usePathname pour obtenir le chemin
import Head from "next/head"; // Importer Head depuis next/head

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname(); // Obtenez le chemin actuel avec usePathname

    const isAuthPage = pathname.startsWith("/auth");

    return (
        <html lang="en">
        <SessionProviderWrapper>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            {/* Ajout de Head pour la gestion du titre et des métadonnées */}
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
            </Head>

            {!isAuthPage && <Header />}
            {children}
            {!isAuthPage && <Footer />}
            </body>
        </SessionProviderWrapper>
        </html>
    );
}
