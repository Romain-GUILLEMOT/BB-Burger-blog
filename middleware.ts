import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname
    if (((req.cookies.get('__Secure-authjs.session-token') || req.cookies.get('__Secure-authjs.callback-url') || (!req.cookies.get('authjs.csrf-token') || !req.cookies.get('authjs.session-token'))) && (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))) {
        return NextResponse.redirect(new URL("/auth/login", req.url))
    }

    if (((req.cookies.get('__Secure-authjs.session-token') || req.cookies.get('__Secure-authjs.callback-url')) || (req.cookies.get('authjs.csrf-token') && req.cookies.get('authjs.session-token'))) && pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*", "/auth/:path*"],
}
