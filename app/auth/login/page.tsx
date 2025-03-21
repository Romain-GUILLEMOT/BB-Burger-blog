"use client";

import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Loading from "@/components/elements/Loading";

export default function Login() {
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [imgsrc, setLogosrc] = useState<string>("https://assets.romain-guillemot.dev/greenlaglogolong.webp");
    const [videosrc, setVideosrc] = useState<string>("https://assets.romain-guillemot.dev/bgvideogreenlag.mp4");
    const [showErrorCross, setShowErrorCross] = useState(false);
    const doom = new Audio("https://assets.romain-guillemot.dev/doom.mp3");
    const buzz = new Audio("https://assets.romain-guillemot.dev/buzz.mp3");
    const success = new Audio("https://assets.romain-guillemot.dev/success.mp3");

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validateOnChange: false,
        validateOnBlur: false,
        onSubmit: async (values) => {
            setErrorMessage("");
            try {
                const signInResponse = await signIn("credentials", {
                    redirect: false,
                    email: values.email,
                    password: values.password,
                });


                if (signInResponse?.error) {

                    buzz.play();

                    setTimeout(() => {
                        setShowErrorCross(true);
                    }, 1000);

                    setTimeout(() => {
                        setShowErrorCross(false);
                        setVideosrc("https://assets.romain-guillemot.dev/fire.mp4");
                        setLogosrc("https://assets.romain-guillemot.dev/redlaglogolong.webp");
                        setErrorMessage("Identifiants incorrects.");
                        doom.play();
                    }, 2500);
                } else {
                    setErrorMessage("");
                    setLogosrc("https://assets.romain-guillemot.dev/greenlaglogolong.webp");

                    buzz.pause()
                    doom.pause()
                    success.play();


                    setTimeout(() => {
                        success.pause()
                        window.location.href = "/dashboard";
                    }, 1500 );
                }
            } catch (error) {
                buzz.play();

                setTimeout(() => {
                    setShowErrorCross(true);
                }, 1000);

                setTimeout(() => {
                    setShowErrorCross(false);
                    setVideosrc("https://assets.romain-guillemot.dev/fire.mp4");
                    setLogosrc("https://assets.romain-guillemot.dev/redlaglogolong.webp");

                    setErrorMessage("Identifiants incorrects.");
                    doom.play();
                }, 2500);
            }
        }
    });

    useEffect(() => {

        let loadedCount = 0;
        const checkIfLoaded = () => {
            loadedCount++;
            if (loadedCount === 3) {
                setIsLoaded(true); // Tous les sons sont chargés, on affiche la page
            }
        };

        doom.addEventListener("canplaythrough", checkIfLoaded, { once: true });
        buzz.addEventListener("canplaythrough", checkIfLoaded, { once: true });
        success.addEventListener("canplaythrough", checkIfLoaded, { once: true });

        doom.load();
        buzz.load();
        success.load();
        return () => {
            doom.removeEventListener("canplaythrough", checkIfLoaded);
            buzz.removeEventListener("canplaythrough", checkIfLoaded);
            success.removeEventListener("canplaythrough", checkIfLoaded);
        };
    }, []);
    if (!isLoaded) {
        return (
            <Loading/>
        );
    }
    return (
        <>
            {showErrorCross && (
                <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                    <XCircleIcon className="w-64 h-64 text-red-600 animate-bounce animate-shake" />
                </div>
            )}
            <div className={`flex min-h-screen ${errorMessage ? "bg-red-900" : "bg-white"}`}>
                {/* Formulaire de connexion */}

                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className={`mx-auto w-full max-w-sm lg:w-96 p-12   ${errorMessage ? 'animate-shake bg-red-100 border-red-500' : 'bg-slate-100 border-slate-200'} shadow-lg rounded-lg`}>
                        <div>
                            <img
                                alt="Votre Entreprise"
                                key={imgsrc}
                                src={imgsrc}
                                className="h-1/4 w-auto my-0 mx-auto margin-top-0" // Ajustement de la taille du logo et marges pour le placer bien en haut
                            />
                            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Connectez-vous</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Pas encore membre ?{' '}
                                <a href="/auth/register" className={`font-semibold ${(errorMessage) ? 'text-red-700 hover:text-red-900 ' : 'text-green-700 hover:text-green-900 '}`}>

                                Créez votre compte
                                </a>
                            </p>
                        </div>

                        <div className="mt-10">
                            <form onSubmit={formik.handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-900">Adresse e-mail</label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            required
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">Mot de passe</label>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            required
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1"
                                        />
                                    </div>
                                </div>

                                {errorMessage && (
                                    <p className="text-white bg-red-600 p-2 rounded-md text-sm text-center mt-2">
                                        {errorMessage}
                                    </p>
                                )}

                                <div>
                                    <button
                                        type="submit"
                                        className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm ${
                                            errorMessage ? "bg-red-700 animate-shake" : "bg-green-800 hover:bg-green-900"
                                        }`}
                                    >
                                        Se connecter
                                    </button>
                                </div>
                            </form>

                            <div className="mt-10">
                                <div className="relative">
                                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm font-medium">
                                        <span className={" px-6 text-gray-900"}>Ou connectez-vous avec</span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <a
                                        href="#"
                                        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                                    >
                                        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                                            <path
                                                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                                fill="#EA4335"
                                            />
                                            <path
                                                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                                fill="#34A853"
                                            />
                                        </svg>
                                        <span className="font-semibold">Google</span>
                                    </a>

                                    <a
                                        href="#"
                                        className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                                    >
                                        <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden="true" className="size-5 fill-[#24292F]">
                                            <path
                                                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                            />
                                        </svg>
                                        <span className="font-semibold">GitHub</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vidéo de fond */}
                <div className="relative hidden w-0 flex-1 lg:block">
                    <video key={videosrc} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                        <source src={videosrc} type="video/mp4" />
                    </video>
                </div>
            </div>
        </>
    );
}
