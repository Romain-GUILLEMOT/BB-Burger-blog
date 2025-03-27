"use client";
import React, {useEffect, useState} from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import createNotification from "@/components/elements/Notification";
import ButtonElement from './BouttonElement';
import Loading from "@/components/elements/Loading";
import ky from "ky";

interface ContactDialogProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ContactFormValues {
    fullName: string;
    phoneNumber: string;
    email: string;
    additionalInfo: string;
    contactReason: string;
}

export default function ContactDialog({ open, setOpen }: ContactDialogProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, [open])
    const { control, handleSubmit } = useForm<ContactFormValues>({
        defaultValues: {
            contactReason: '',
            fullName: '',
            phoneNumber: '',
            email: '',
            additionalInfo: '',
        },
    });
    const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
        setLoading(true);
        try {
            const response = await ky.post("/api/contact", {
                json: {
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    email: data.email,
                    additionalInfo: data.additionalInfo,
                    contactReason: data.contactReason,
                },
            }).json<{ status: string }>();

            if (response.status === "success") {
                createNotification({ type: "success", message: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais." });
                setTimeout(() => {
                    setOpen(false);
                }, 1500);
            } else {
                createNotification({ type: "error", message: "Une erreur est survenue. Veuillez réessayer." });
            }
        } catch (e: any) {
            createNotification({ type: "error", message: e.message || "Une erreur est survenue. Veuillez réessayer." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
            <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-6 py-5 text-left shadow-xl w-full max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Informations de contact */}
                            <div className="col-span-1 md:col-span-1 space-y-4">
                                <DialogTitle as="h3" className="text-xl font-semibold text-green-700">
                                    Contactez-nous
                                </DialogTitle>
                                <p className="text-sm text-gray-600">📞 <strong>Téléphone :</strong></p>
                                <p className="text-base font-medium text-green-900">06 12 34 56 78</p>
                                <p className="text-sm text-gray-600">✉️ <strong>Email :</strong></p>
                                <p className="text-base font-medium text-green-900">contact@bbburger.com</p>
                            </div>
                            {/* Formulaire de contact */}
                            <div className="col-span-1 md:col-span-3">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                    <div>
                                        <Controller
                                            name="contactReason"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Raison du contact"
                                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Controller
                                            name="fullName"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="Nom & Prénom"
                                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                                />
                                            )}
                                        />
                                        <Controller
                                            name="phoneNumber"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="text"
                                                    placeholder="0612345678"
                                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <Controller
                                            name="email"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    {...field}
                                                    type="email"
                                                    placeholder="mail@exemple.com"
                                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <Controller
                                            name="additionalInfo"
                                            control={control}
                                            render={({ field }) => (
                                                <textarea
                                                    {...field}
                                                    placeholder="Votre message"
                                                    className="block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                                                    rows={4}
                                                ></textarea>
                                            )}
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <ButtonElement onClick={() => setOpen(false)} type={'secondary'} blue={true}>
                                            Fermer
                                        </ButtonElement>
                                        <ButtonElement
                                            type={'info'}
                                            buttonType="submit"
                                            disabled={loading}
                                            className="bg-green-700 text-white"
                                        >
                                            {loading ? <Loading/> : 'Envoyer'}
                                        </ButtonElement>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}