import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from './helper/getDataFromToken';
import jwt from 'jsonwebtoken';

const isPublicRoute = createRouteMatcher([
    // "/",
    // "/home",
    "/signin",
    "/signup"
])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos",
    "/api/signup",
    "/api/signin",
])

export async function middleware(req: NextRequest){
    const token = req.cookies.get("token")

    const currUrl = new URL(req.url)

    const isHomePage = currUrl.pathname === "/home"
    const isApiRequest = currUrl.pathname.startsWith("/api")

    if(token && isPublicRoute(req) && !isHomePage){
        return NextResponse.redirect(new URL("/home", req.url))
    }

    if(!token){
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/signin", req.url))
        }

        if(isApiRequest && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/signin", req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}