import Image from "next/image";

export default function Home() {
    const articles = [
        {
            id: 1,
            image: "/image1.jpg",
            title: "Titre de l'article 1",
            description: "Description rapide de l'article 1...",
            link: "/article/1"
        },
        {
            id: 2,
            image: "/image2.jpg",
            title: "Titre de l'article 2",
            description: "Description rapide de l'article 2...",
            link: "/article/2"
        },
        {
            id: 3,
            image: "/image3.jpg",
            title: "Titre de l'article 3",
            description: "Description rapide de l'article 3...",
            link: "/article/3"
        },
        {
            id: 4,
            image: "/image4.jpg",
            title: "Titre de l'article 4",
            description: "Description rapide de l'article 4...",
            link: "/article/4"
        },
        {
            id: 5,
            image: "/image5.jpg",
            title: "Titre de l'article 5",
            description: "Description rapide de l'article 5...",
            link: "/article/5"
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
            {/* Texte principal */}
            <h1 className="text-4xl sm:text-6xl font-bold text-center mb-12">
                Avec <span className="text-green-600">GreenLag</span>, le changement c&apos;est maintenant
            </h1>

            {/* Section Dernières Nouvelles */}
            <section className="w-full max-w-6xl text-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-8">
                    Dernières Nouvelles
                </h2>

                {/* Grilles dynamiques */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
                    {articles.slice(0, 3).map((article) => (
                        <div
                            key={article.id}
                            className="relative group w-full aspect-square bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            <Image
                                src={article.image}
                                alt={`Image de ${article.title}`}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-lg font-semibold">{article.title}</h3>
                                <p className="text-sm mb-4">{article.description}</p>
                                <a
                                    href={article.link}
                                    className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition"
                                >
                                    Voir plus
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {articles.slice(3).map((article) => (
                        <div
                            key={article.id}
                            className="relative group w-full aspect-square bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                        >
                            <Image
                                src={article.image}
                                alt={`Image de ${article.title}`}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="text-lg font-semibold">{article.title}</h3>
                                <p className="text-sm mb-4">{article.description}</p>
                                <a
                                    href={article.link}
                                    className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition"
                                >
                                    Voir plus
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
