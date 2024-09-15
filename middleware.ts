import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest){
    const token = req.cookies.get("token")

    const currUrl = new URL(req.url)

    const isHomePage = currUrl.pathname === "/home"
    const isApiRequest = currUrl.pathname.startsWith("/api")

    if(token && (
        currUrl.pathname.startsWith("/signin") || 
        currUrl.pathname.startsWith("/signup") || 
        currUrl.pathname.startsWith("/reset-password") 
    ) && !isHomePage){
        return NextResponse.redirect(new URL("/home", req.url))
    }

    if(!token){
        if(!(
            currUrl.pathname.startsWith("/signin") || 
            currUrl.pathname.startsWith("/signup") || 
            currUrl.pathname.startsWith("/reset-password") 
        ) && !(
            currUrl.pathname.startsWith("/api/videos") || 
            currUrl.pathname.startsWith("/api/signup") || 
            currUrl.pathname.startsWith("/api/signin") || 
            currUrl.pathname.startsWith("/api/reset-password")
        )){
            return NextResponse.redirect(new URL("/signin", req.url))
        }

        if(isApiRequest && !(
            currUrl.pathname.startsWith("/api/videos") || 
            currUrl.pathname.startsWith("/api/signup") || 
            currUrl.pathname.startsWith("/api/signin") || 
            currUrl.pathname.startsWith("/api/reset-password")
        )){
            return NextResponse.redirect(new URL("/signin", req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
