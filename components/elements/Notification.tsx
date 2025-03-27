"use client";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client"; // Utilisation de createRoot pour React 18
import { Transition } from "@headlessui/react";
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";

interface NotificationProps {
    type: "info" | "warning" | "error" | "success";
    message: string;
}

interface NotificationComponentProps extends NotificationProps {
    id: number;
    show: boolean;
    removeNotification: (id: number) => void;
}

function Notification({ id, type, message, show, removeNotification }: NotificationComponentProps) {
    let icon;
    let iconColor;

    switch (type) {
        case "info":
            icon = <InformationCircleIcon className="h-8 w-8 text-blue-500" />;
            iconColor = "text-blue-500";
            break;
        case "warning":
            icon = <ExclamationCircleIcon className="h-8 w-8 text-yellow-500" />;
            iconColor = "text-yellow-500";
            break;
        case "error":
            icon = <ExclamationCircleIcon className="h-8 w-8 text-red-500" />;
            iconColor = "text-red-500";
            break;
        case "success":
            icon = <CheckCircleIcon className="h-8 w-8 text-green-500" />;
            iconColor = "text-green-500";
            break;
        default:
            icon = <InformationCircleIcon className="h-8 w-8 text-gray-500" />;
            iconColor = "text-gray-500";
    }
    const typeLabels: Record<string, string> = {
        info: "Information",
        warning: "Avertissement",
        error: "Erreur",
        success: "Succès",
    };

    const translatedType = typeLabels[type] || "Information";
    return (
        <Transition
            appear
            show={show}
            enter="transform ease-out duration-300 transition"
            enterFrom="opacity-0 translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="transform ease-in duration-300 transition"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-4"
            className="pointer-events-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-black/5"
        >
            <div className="p-6 z-50">
                <div className="flex items-start">
                    <div className="shrink-0">
                        {icon}
                    </div>
                    <div className="ml-4 w-0 flex-1 pt-0.5">
                        <p className="text-lg font-bold text-gray-900 capitalize">{translatedType}</p>
                        <p className="mt-2 text-md text-gray-600">{message}</p>
                    </div>
                    <div className="ml-4 flex shrink-0">
                        <button
                            type="button"
                            onClick={() => removeNotification(id)}
                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <span className="sr-only">Close</span>
                            <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    );
}

const notificationQueue: { id: number; type: "info" | "warning" | "error" | "success"; message: string }[] = [];
let currentId = 0;

export default function createNotification({ type, message }: NotificationProps) {
    const container = document.getElementById("notification-container");

    if (!container) {
        const newContainer = document.createElement("div");
        newContainer.id = "notification-container";
        newContainer.className = "z-50 fixed inset-0 flex flex-col items-end justify-end px-6 py-8 space-y-6 pointer-events-none";
        document.body.appendChild(newContainer);
        ReactDOM.createRoot(newContainer).render(<NotificationManager />);
    }

    notificationQueue.push({ id: ++currentId, type, message });
}

function NotificationManager() {
    const [notifications, setNotifications] = useState<{ id: number; type: "info" | "warning" | "error" | "success"; message: string; show: boolean }[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (notifications.length < notificationQueue.length) {
                const newNotifications = notificationQueue.map((n) => ({ ...n, show: true }));
                setNotifications(newNotifications);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [notifications]);

    useEffect(() => {
        notifications.forEach((notification) => {
            setTimeout(() => {
                hideNotification(notification.id);
            }, 5000);
        });
    }, [notifications]);

    function hideNotification(id: number) {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, show: false } : n))
        );
        setTimeout(() => removeNotification(id), 300); // Allow time for exit animation
    }

    function removeNotification(id: number) {
        const index = notificationQueue.findIndex((n) => n.id === id);
        if (index !== -1) {
            notificationQueue.splice(index, 1);
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }
    }

    const maxVisibleNotifications = 3;
    const visibleNotifications = notifications.slice(-maxVisibleNotifications);
    const additionalCount = notifications.length - visibleNotifications.length;

    return (
        <div className=" z-50 fixed inset-0 flex flex-col items-end justify-end px-6 py-8 space-y-6 pointer-events-none">
            {visibleNotifications.map((n) => (
                <Notification
                    key={n.id}
                    id={n.id}
                    type={n.type}
                    message={n.message}
                    show={n.show}
                    removeNotification={removeNotification}
                />
            ))}
            {additionalCount > 0 && (
                <div className="flex items-center justify-center w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
                    <p className="text-lg font-medium text-gray-900">+{additionalCount} autres</p>
                </div>
            )}
        </div>
    );
}