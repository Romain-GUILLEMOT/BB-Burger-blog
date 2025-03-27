import React from 'react';

export default function Loading() {

    return (
        <div className="w-full h-full mx-auto my-auto cursor-wait ">
            <div className="mx-auto text-center">
                    <img
                        src="https://assets.romain-guillemot.dev/greenlaglogo_full.webp"
                        className="h-4 w-4 mx-auto rounded-full loader"
                        alt="Logo"
                    />

            </div>
        </div>
    );
}