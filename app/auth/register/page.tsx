export default function Register() {
    return (
        <>
            <div className="flex min-h-screen">
                {/* Formulaire d'inscription */}
                <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96 p-12 bg-white shadow-lg rounded-lg">
                        <div>
                            <img
                                alt="Votre Entreprise"
                                src="https://assets.romain-guillemot.dev/greenlaglogolong.webp"
                                className="h-1/4 w-auto my-0 mx-auto margin-top-0" // Ajustement de la taille du logo et marges pour le placer bien en haut
                            />
                            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">Créez votre compte</h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Déjà membre ?{' '}
                                <a href="/auth/login" className="font-semibold text-green-700 hover:text-green-900">
                                    Connectez-vous
                                </a>
                            </p>
                        </div>

                        <div className="mt-10">
                            <form action="#" method="POST" className="space-y-6">
                                <div>
                                    <label htmlFor="full-name" className="block text-sm font-medium text-gray-900">
                                        Nom complet
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="full-name"
                                            name="full-name"
                                            type="text"
                                            required
                                            autoComplete="name"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-green-600 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                        Adresse e-mail
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-green-600 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                                        Mot de passe
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            autoComplete="new-password"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-green-600 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-900">
                                        Confirmer le mot de passe
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="confirm-password"
                                            name="confirm-password"
                                            type="password"
                                            required
                                            autoComplete="new-password"
                                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:outline-green-600 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                        <a href="#" className="font-semibold text-green-600 hover:text-green-500">
                                            Vous avez déjà un compte ? Connectez-vous
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-green-800 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                    >
                                        S'inscrire
                                    </button>
                                </div>
                            </form>

                            <div className="mt-10">
                                <div className="relative">
                                    <div aria-hidden="true" className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm font-medium">
                                        <span className="bg-white px-6 text-gray-900">Ou continuez avec</span>
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
                                                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.25-4.555-1.125-4.555-5.013 0-1.11.398-2.021 1.054-2.732-.106-.261-.455-1.323.095-2.756 0 0 .85-.273 2.79.864a9.348 9.348 0 0 1 2.54-.341c.86 0 1.728.11 2.54.341 1.94-1.137 2.79-.864 2.79-.864.551 1.433.202 2.495.095 2.756.657.711 1.054 1.622 1.054 2.732 0 3.897-2.336 4.76-4.561 5.013.354.302.686.896.686 1.742 0 1.256-.015 2.28-.015 2.588 0 .268.18.577.687.48C17.135 18.197 20 14.428 20 10.017 20 4.484 15.523 0 10 0z"
                                            />
                                        </svg>
                                        <span className="font-semibold">GitHub</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image d'arrière-plan */}
                <div className="relative hidden w-0 flex-1 lg:block">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source
                            src="https://assets.romain-guillemot.dev/bgvideogreenlag.mp4"
                            type="video/mp4"
                        />
                    </video>
                </div>
            </div>
        </>
    );
}
