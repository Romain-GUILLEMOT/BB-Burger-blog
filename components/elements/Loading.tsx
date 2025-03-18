import React from 'react';

export default function Loading() {

    return (
        <div className="w-full h-full mx-auto my-auto cursor-wait ">
            <div className="mx-auto text-center">
                <div className="loader">
                    <img
                        src="https://assets.ozlaloc.fr/logo/logo_min_transparent.webp"
                        className="h-6 w-6 mx-auto"
                        alt="Logo"
                    />
                </div>

            </div>
        </div>
    );
}