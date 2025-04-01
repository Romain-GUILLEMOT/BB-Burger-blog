'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import createNotification from "@/components/elements/Notification";

export default function ErrorPage()  {
    const router = useRouter()

    useEffect(() => {
        createNotification({ message: "Une erreur inconnue est survenue", type: 'error' })
        router.push('/auth/login')
    })

    return null
}
