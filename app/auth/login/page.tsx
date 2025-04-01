"use client";

import { signIn } from "next-auth/react";
import {useState, useEffect, useRef} from "react";
import Loading from "@/components/elements/Loading";
import createNotification from "@/components/elements/Notification";

const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a', 's' // bonus le "s" à la fin si tu veux un troll
]

export default function Login() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [konami, setKonami] = useState<boolean>(false)

    const doom = new Audio("https://assets.romain-guillemot.dev/doom.mp3");
    const buzz = new Audio("https://assets.romain-guillemot.dev/buzz.mp3");
    const success = new Audio("https://assets.romain-guillemot.dev/success.mp3");
    const inputRef = useRef<string[]>([])


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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            inputRef.current.push(e.key)
            inputRef.current = inputRef.current.slice(-KONAMI_CODE.length)

            if (inputRef.current.join(',') === KONAMI_CODE.join(',')) {
                setKonami(true)
                createNotification({type: "error", message: "Aperture Science ▒▒░Ξ∮⚠︎_⧉⧉{INIT.Φ512x}▒█𓂀⟟⧗//↯↯↯ SYSTEM BREΔK .v1⧸✖︎⩨𒐫𒀭🜛❖⨳⛧𓆣💾...∑ΣRΞBOOT?☣︎"})
                inputRef.current = [] // reset après détection
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    })
    if (!isLoaded) {
        return (
            <Loading/>
        );
    }
    return (
        <>
            {!konami ? (
            <div className={`flex min-h-screen bg-white`}>
                {/* Formulaire de connexion */}

                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className={`mx-auto w-full max-w-sm lg:w-96 p-12   bg-slate-100 border-slate-200 shadow-lg rounded-lg`}>
                        <div>
                            <img
                                alt="Grennlagg"
                                src={"https://assets.romain-guillemot.dev/greenlagg/greenlagg_full.webp"}
                                className="h-1/4 w-auto my-0 mx-auto margin-top-0" // Ajustement de la taille du logo et marges pour le placer bien en haut
                            />
                            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Connectez-vous</h2>

                        </div>

                        <div className="mt-10">


                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={async () => {
                                            await signIn("google")
                                        }}
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
                                    </button>

                                    <button
                                        onClick={async () => {
                                            await signIn("github")
                                        }}
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
                                    </button>
                            </div>

                                <img
                                    onClick={async () => {
                                        await signIn("osu")
                                    }}
                                    className="mt-4 hover:opacity-50 duration-300"
                                    src="https://assets.romain-guillemot.dev/greenlagg/osu.png"
                                    alt="osu! logo"
                                />

                        </div>
                    </div>
                </div>

                {/* Vidéo de fond */}
                <div className="relative hidden w-0 flex-1 lg:block">
                    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                        <source src={"https://assets.romain-guillemot.dev/bgvideogreenlag.mp4"} type="video/mp4" />
                    </video>
                </div>
            </div>
            ): (
                <>
                <div className="h-full w-full bg-[#0f0f0f] text-green-400  p-6 shadow-xl flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 overflow-auto">
    <pre className="bg-[#111] p-4 rounded-lg overflow-auto text-sm leading-relaxed">
      <code>
{`float Q_rsqrt( float number )
{
    long i;
    float x2, y;
    const float threehalfs = 1.5F;

    x2 = number * 0.5F;
    y  = number;
    i  = * ( long * ) &y;                        // evil floating point bit level hacking
    i  = 0x5f3759df - ( i >> 1 );                // what the fuck?
    y  = * ( float * ) &i;
    y  = y * ( threehalfs - ( x2 * y * y ) );    // 1st iteration
//  y  = y * ( threehalfs - ( x2 * y * y ) );    // 2nd iteration, this can be removed

    return y;
}`}
      </code>
    </pre>
                    </div>

                    <div className="md:w-1/3 flex justify-center items-center">
                        <img
                            src="https://assets.romain-guillemot.dev/greenlagg/hex.jpg"
                            alt="Énigme hex Cyberpunk"
                            className="rounded-lg shadow-lg max-w-full h-auto"
                        />
                    </div>

                    <audio autoPlay loop className="hidden">
                        <source src="https://assets.romain-guillemot.dev/greenlagg/portal.mp3" type="audio/mpeg" />
                    </audio>
                </div>
                    <div className={'flex object-fill h-full w-full bg-black'}>

        <div className="md:w-1/3 flex justify-center items-center">
            <img
                src="https://assets.romain-guillemot.dev/greenlagg/aperture.jpeg"
                alt="Énigme hex Cyberpunk"
                className="rounded-lg shadow-lg max-w-full h-auto"
            />
        </div>
        <div className="md:w-2/3 flex justify-center items-center">
            <img
                src="https://assets.romain-guillemot.dev/greenlagg/qr.png"
                alt="Énigme hex Cyberpunk"
                className="rounded-lg shadow-lg h-64"
            />
        </div>
        <div className="md:w-1/3 flex justify-center items-center">
            <img
                src="https://assets.romain-guillemot.dev/greenlagg/herobrine.webp"
                alt="Énigme hex Cyberpunk"
                className="rounded-lg shadow-lg max-w-full h-auto"
            />
        </div>
    </div>
                    <div className={'flex object-fill h-full w-full bg-black'}>

                        <div className="md:w-1/3 flex justify-center items-center">
                            <img
                                src="https://assets.romain-guillemot.dev/greenlagg/subnautica.jpg"
                                alt="Énigme hex Cyberpunk"
                                className="rounded-lg shadow-lg max-w-full h-auto"
                            />
                        </div>
                        <div className="md:w-2/3 flex justify-center items-center">
                            <img
                                src="https://assets.romain-guillemot.dev/greenlagg/aa.webp"
                                alt="Énigme hex Cyberpunk"
                                className="rounded-lg shadow-lg h-64"
                            />
                        </div>
                        <div className="md:w-1/3 flex justify-center items-center">
                            <img
                                src="https://assets.romain-guillemot.dev/greenlagg/lav.png"
                                alt="Énigme hex Cyberpunk"
                                className="rounded-lg shadow-lg max-w-full h-auto"
                            />
                        </div>
                    </div>

                </>

            )}
        </>
    );
}
