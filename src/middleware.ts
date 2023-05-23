import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'




export async function middleware( req: NextRequest, ev: NextFetchEvent ) {
    const token = req.cookies.get('token')?.value || '';

    try {
        await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET_SEED)
            )
        return NextResponse.next();

    } catch (error) {
        console.log('Error')
        const { pathname } = req.nextUrl;
        return NextResponse.redirect( new URL(`/auth/login?p=${pathname}`, req.url ) )
    }
    

} 
export const config = {
    matcher: '/checkout/:path*',
}