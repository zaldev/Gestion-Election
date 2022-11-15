import { NextApiRequest } from "next"
import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"


export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|favicon.ico).*)',
    ],
}

export async function middleware(req: NextRequest) {

    const url = req.nextUrl.clone()



    if (url.href?.includes('/admin') || url.href?.includes('/voter') || url.href?.includes('/profil')) {
        // console.log("++++++++++++++++++++++++++++")
        // console.log(url.href)
        const session = await getToken({ req, secret: process.env.SECRET })
        // const url = '/'
        // url.pathname = '/'
        if (session == null) return NextResponse.rewrite(new URL('/', req.url))
        if (url.href?.includes('/admin')) {
            const { user } = session
            // console.log("+++++++++++++++   +++++++++++++")
            // console.log(req.url)

            if (!user?.admin) return NextResponse.rewrite(new URL('/', req.url))

        }
        return NextResponse.next()
    }


    // You could also check for any property on the session object,
    // like role === "admin" or name === "John Doe", etc.

    // if (!session) return NextResponse.redirect("/api/auth/signin")

    // If user is authenticated, continue.
    return NextResponse.next()
}








// export { default } from "next-auth/middleware"

// export const config = { matcher: ["/admin"], secret : process.env.NEXTAUTH_SECRET }

// import { NextResponse } from "next/server";
// import type { NextRequest } from 'next/server'

// const secret = process.env.SECRET || "secret";

// export default async function middleware(req: NextRequest) {
//     console.log(req.credentials)
    // const jwt = req.cookies.get("OutsiteJWT");
    // const url = req.url;
    // const { pathname } = req.nextUrl;

    // if (pathname.startsWith("/dashboard")) {
    //     if (jwt === undefined) {
    //         req.nextUrl.pathname = "/login";
    //         return NextResponse.redirect(req.nextUrl);
    //     }

    //     try {
    //         await verify(jwt, secret);
    //         return NextResponse.next();
    //     } catch (error) {
    //         req.nextUrl.pathname = "/login";
    //         return NextResponse.redirect(req.nextUrl);
    //     }
    // }

//     return NextResponse.next();
// }