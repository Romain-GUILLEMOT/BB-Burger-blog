// lib/fetcher.ts
import ky from "ky";

export const kyFetcher = async (url: string | URL): Promise<any> => {
    const response = await ky(url.toString(), {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-Frontend-URL': window.location.pathname,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    return await response.json();
};
