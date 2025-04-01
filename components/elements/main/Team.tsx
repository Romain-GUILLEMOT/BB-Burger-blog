'use client'

import Image from 'next/image'
import { PhoneIcon } from '@heroicons/react/24/solid'

const people = [
    {
        name: 'Romain Guillemot',
        role: 'Responsable DevOps & Administrateur Infrastructure',
        imageUrl:
            'https://assets.romain-guillemot.dev/moianime-2.png',
        phone: 'tel:3395551076',
        linkedinUrl: 'https://www.linkedin.com/in/romain-guillemot/',
        hoverColor: 'hover:ring-orange-500 ',
        imgcolor: 'border-orange-500 border-4'
    },

    {
        name: 'Enzo Decatheaugrue',
        role: 'Responsable développement',
        imageUrl:
            'https://media.licdn.com/dms/image/v2/D4E35AQEK-UfXdD3zSQ/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1734956693572?e=1743760800&v=beta&t=M4T8xcHWYZ93hk94YpxcykwGvXkCBG8u__9mOENegp0',
        phone: 'tel:33646614316',
        linkedinUrl: 'https://www.linkedin.com/in/enzo-decatheaugrue/',
        hoverColor: 'hover:ring-blue-500 ',
        imgcolor: 'border-blue-500 border-4'
    },
    {
        name: 'Jonathan Tembo',
        role: 'Concepteur de contenu Green IT',
        imageUrl:
            'https://media.licdn.com/dms/image/v2/D4E35AQGMu5H3xbpdUQ/profile-framedphoto-shrink_400_400/profile-framedphoto-shrink_400_400/0/1733832427094?e=1743760800&v=beta&t=52RO9hpoHMdG5Rk9brj7mEtS3FV_PxdQ1s8SX1s8_bc',
        phone: 'tel:3312748324',
        linkedinUrl: 'https://www.linkedin.com/in/jonathan-tembo-88509825a/',
        hoverColor: 'hover:ring-purple-500',
        imgcolor: 'border-purple-500 border-2'
    },
    {
        name: 'Mohamed Mbow',
        role: 'Ingénieur Base64',
        imageUrl:
            'https://media.licdn.com/dms/image/v2/D4E35AQEegFQ6lVreFA/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1733825668575?e=1744142400&v=beta&t=jcmlX_3rHsJn9z2tpSEmTMayDzYo_KZ1ybH5KKlCGeA',
        phone: 'tel:33600000000',
        linkedinUrl: 'https://www.linkedin.com/in/mohamed-mbow/',
        hoverColor: 'hover:ring-cyan-500',
        imgcolor: 'border-cyan-500 border-2'
    },
]

export default function Equipe() {
    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        Rencontrez notre équipe
                    </h2>
                    <p className="mt-6 text-lg/8 text-gray-600">
                        Un collectif engagé pour un numérique plus sobre, plus durable et plus humain. Nous partageons ici nos idées, nos pratiques et notre vision du Green IT.
                    </p>
                </div>
                <ul
                    role="list"
                    className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-4"
                >
                    {people.map((person) => (
                        <li
                            key={person.name}
                            className={`rounded-2xl bg-white px-8 py-10 shadow transition duration-300 hover:scale-[1.03] hover:shadow-lg ring-1 ring-gray-200 ${person.hoverColor}`}
                        >
                            <Image
                                alt={person.name}
                                src={person.imageUrl}
                                width={224}
                                height={224}
                                className={`mx-auto size-48 rounded-full md:size-56 object-cover ${person.imgcolor}`}
                            />
                            <h3 className="mt-6 text-base/7 font-semibold tracking-tight text-gray-900">{person.name}</h3>
                            <p className="text-sm/6 text-gray-600">{person.role}</p>
                            <ul role="list" className="mt-6 flex justify-center gap-x-6">
                                <li>
                                    <a href={person.phone} className="text-gray-400 hover:text-gray-700">
                                        <span className="sr-only">Téléphone</span>
                                        <PhoneIcon className="size-5" aria-hidden="true" />
                                    </a>
                                </li>
                                <li>
                                    <a href={person.linkedinUrl} className="text-gray-400 hover:text-gray-700">
                                        <span className="sr-only">LinkedIn</span>
                                        <svg fill="currentColor" viewBox="0 0 20 20" className="size-5" aria-hidden="true">
                                            <path
                                                fillRule="evenodd"
                                                d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </a>
                                </li>
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
