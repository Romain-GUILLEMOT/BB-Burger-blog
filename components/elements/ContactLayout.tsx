"use client"
import React, {Suspense, useEffect, useState} from "react";
import {PhoneIcon} from "@heroicons/react/16/solid";
import {XMarkIcon} from "@heroicons/react/20/solid";
import Loading from "@/components/elements/Loading";
import ContactDialog from "@/components/elements/ContactDialog";
import {usePathname} from "next/navigation";

export default function ContactLayout() {
    const [isContactOpen, setContactOpen] = useState<boolean>(false);
    const [isContactIcon, setContactIcon] = useState<boolean>(true);
    const pathname = usePathname()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <>
            {/* Bouton rond en bas à droite */}
            {isContactIcon && (
                <div
                    className="fixed bottom-5 right-5 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl border-green-600 border-2 cursor-pointer"
                    onClick={() => setContactOpen(!isContactOpen)}
                    title="Contactez-nous"
                >
                    <PhoneIcon className={'h-6 w-6 text-green-600'}/>
                    <div
                        className="absolute -top-1 -right-1 w-5 h-5 text-white bg-green-600 opacity-50 text-xs flex items-center justify-center rounded-full cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setContactIcon(false);
                        }}
                        title="Fermer"
                    >
                        <XMarkIcon className={'h-full w-full text-white'}/>
                    </div>
                </div>

            )}


            {/* Boîte de contact */}
            {isContactOpen && (
                <Suspense fallback={<Loading/>}>
                    <ContactDialog open={isContactOpen} setOpen={setContactOpen}/>
                </Suspense>
            )}
        </>
    )
}