import React from 'react';

export default function Loading() {

    return (
        <div className="w-full h-full mx-auto my-auto cursor-wait ">
            <div className="mx-auto text-center">
                <div className="loader animate-spin">
                    <img
                        src="https://assets.romain-guillemot.dev/greenlaglogo_full.webp"
                        className="h-32 w-32 mx-auto rounded-full animate-spin"
                        alt="Logo"
                    />
                </div>

            </div>
        </div>
    );
}