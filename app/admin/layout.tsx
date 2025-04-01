"use client";

import React, {useEffect, useState} from "react";
import { Dialog } from "@headlessui/react";
import { Geist, Geist_Mono } from "next/font/google";
import { Bars3Icon, UserIcon, DocumentTextIcon, ChartBarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useSession} from "next-auth/react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const TABS = {
    users: "Utilisateurs",
    articles: "Articles",
    stats: "Statistiques",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const { data: session, status } = useSession();

    useEffect(() => {
        const checkUserRole = async () => {
            if (status === "loading") return; // attend que la session soit prête


            if (session?.user?.role === "ADMIN") {
                setIsAdmin(true);
                if(pathname === '/admin' || pathname === '/admin/') {
                    router.push("/admin/users");
                }
            } else {
                router.push("/");
            }
        };

        checkUserRole();
    }, [status, session]);
    if(!isAdmin) {
        return <></>
    }
    const SidebarItem = ({ name, href, Icon }: { name: string, href: string; Icon: any }) => (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-sm font-medium
        ${
                pathname.startsWith(href)
                    ? "bg-green-700 text-white shadow"
                    : "text-green-700 hover:bg-green-50 hover:text-green-900"
            }`}
        >
            <Icon className="w-5 h-5" />
            {name}
        </Link>
    );

    return (
        <div className="antialiased bg-white">
        <div className="flex min-h-screen">
            {/* Sidebar mobile */}
            <Dialog
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                className="lg:hidden"
            >
                <Dialog.Panel className="fixed inset-0 z-40 bg-black/50">
                    <div className="fixed left-0 top-0 h-full w-64 bg-white p-4 shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-green-700">
                                GreenLagg Admin
                            </h2>
                            <button onClick={() => setSidebarOpen(false)}>
                                <XMarkIcon className="w-5 h-5 text-green-700" />
                            </button>
                        </div>
                        <nav className="space-y-2">
                            <SidebarItem name="Utilisateurs" href="/admin/users" Icon={UserIcon} />
                            <SidebarItem name="Articles" href="/admin/articles" Icon={DocumentTextIcon} />
                            <SidebarItem name="Stats" href="/admin/stats" Icon={ChartBarIcon} />
                        </nav>
                    </div>
                </Dialog.Panel>
            </Dialog>

            {/* Sidebar desktop */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:p-6 lg:shadow-xl">
                <h2 className="text-2xl font-bold mb-8 text-green-700">
                    <a href="/" className="flex-shrink-0 mx-auto">
                        <img className="h-10 sm:h-12" src="https://assets.romain-guillemot.dev/greenlagg/greenlagg_full.webp" alt="GreenLag Logo" />
                    </a>

                </h2>
                <nav className="space-y-2">
                    <SidebarItem name="Utilisateurs" href="/admin/users" Icon={UserIcon} />
                    <SidebarItem name="Articles" href="/admin/articles" Icon={DocumentTextIcon} />
                    <SidebarItem name="Stats" href="/admin/stats" Icon={ChartBarIcon} />
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6">


                {children}
            </main>
        </div>
        </div>
    );
}
