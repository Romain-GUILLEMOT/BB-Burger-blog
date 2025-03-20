import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token) {
        if (req.nextUrl.pathname.startsWith('/auth/')) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    } else {
        if (req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/admin/')) {
            return new Response('Unauthorized', { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/auth/:path*',
        '/dashboard',
        '/admin/:path*',
    ],
};
