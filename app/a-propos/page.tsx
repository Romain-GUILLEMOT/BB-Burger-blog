"use client";
import Head from 'next/head';
import { useState } from 'react';

const About: React.FC = () => {
    const [isContactVisible, setIsContactVisible] = useState(false);

    const toggleContactVisibility = () => {
        setIsContactVisible(!isContactVisible);
    };

    return (
        <div className="bg-white">
            <Head>
                <title>À propos - Green IT</title>
                <meta name="description" content="Blog Green IT" />
            </Head>

            {/* Hero Section */}
            <section className="bg-white text-green-700 text-center py-20 mb-12">
                <h1 className="text-4xl font-extrabold">À propos de notre blog Green IT</h1>
                <p className="mt-4 text-xl">Découvrez des solutions durables pour un avenir numérique plus vert.</p>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Introduction Section */}
                <section className="mb-10 rounded-lg shadow-lg bg-white p-8">
                    <h2 className="text-2xl font-semibold text-green-700">Pourquoi ce blog ?</h2>
                    <p className="mt-4">
                        Les technologies numériques sont essentielles à notre vie quotidienne, mais leur production et leur utilisation
                        génèrent une quantité importante de déchets électroniques et de consommation d’énergie. Avec l'augmentation
                        continue des besoins numériques, il devient crucial d'explorer des alternatives qui limitent l'impact sur notre
                        planète.
                    </p>
                    <p className="mt-4">Notre blog vise à :</p>
                    <ul className="list-disc ml-6 mt-4 space-y-2">
                        <li><strong>Présenter des solutions concrètes</strong> pour rendre l’informatique plus éco-responsable.</li>
                        <li><strong>Analyser les dernières tendances</strong> en matière de Green IT, telles que les data centers éco-efficients, le recyclage des équipements électroniques, et les logiciels optimisés pour une consommation énergétique réduite.</li>
                        <li><strong>Partager des études de cas</strong>, des interviews d'experts et des guides pratiques sur les meilleures pratiques à adopter dans le domaine du Green IT.</li>
                    </ul>
                </section>

                {/* Objectifs Section */}
                <section className="mb-10 rounded-lg shadow-lg bg-white p-8">
                    <h2 className="text-2xl font-semibold text-green-700">Nos Objectifs</h2>
                    <ul className="list-disc ml-6 mt-4 space-y-2">
                        <li><strong>Réduire l'empreinte carbone des technologies</strong> : Nous explorons les différentes manières d'intégrer des pratiques respectueuses de l'environnement dans l'utilisation des technologies.</li>
                        <li><strong>Promouvoir l'innovation durable</strong> : Mises en avant des entreprises et des projets qui font progresser l'industrie technologique tout en respectant des valeurs écologiques.</li>
                        <li><strong>Informer et éduquer</strong> : Offrir un contenu riche et accessible pour tous ceux qui souhaitent comprendre et participer au mouvement du Green IT.</li>
                    </ul>
                </section>

                {/* Qui sommes-nous Section */}
                <section className="mb-10 rounded-lg shadow-lg bg-white p-8">
                    <h2 className="text-2xl font-semibold text-green-700">Qui sommes-nous ?</h2>
                    <p className="mt-4">
                        Nous sommes une équipe passionnée par l'innovation technologique et le respect de l'environnement. Composée de
                        professionnels du secteur IT et de spécialistes de l'écologie numérique, notre équipe s'engage à apporter des
                        solutions novatrices et à sensibiliser le plus grand nombre à l'importance d’un avenir numérique plus vert.
                    </p>
                    <p className="mt-4">
                        Merci de visiter notre blog, et n'hésitez pas à nous contacter pour échanger ou poser des questions. Ensemble, nous pouvons contribuer à un avenir technologique durable !
                    </p>
                </section>
            </main>
        </div>
    );
};

export default About;
