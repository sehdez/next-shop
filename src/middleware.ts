import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Respuesta de la api 
const noAutorizadoMessage = new Response(JSON.stringify({ message: 'No autorizado' }), {
    status: 401,
    headers: {
        'Content-Type': 'application/json'
    }
});


export async function middleware( req: NextRequest, ev: NextFetchEvent ) {
    
    // Obtenemos la sesión del usuario
    const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    const { pathname } = req.nextUrl;
    const isApi = pathname.includes('/api/');

    if( !session ){
        const requestedPage = pathname;
        const url = req.nextUrl.clone();

        url.pathname = `/auth/login`;
        url.search = `p=${requestedPage}`;
        return isApi ? noAutorizadoMessage:  NextResponse.redirect( url );
    }
    if(pathname.includes('/admin')){
        return isAdmin(req, session, isApi)
    }
    return NextResponse.next();

} 
export const config = {
    matcher: [
        '/checkout/:path*', 
        '/admin/:path*' ,
        '/api/admin/:path*' 
    ]
}



const isAdmin = (req: NextRequest, session: any, isApi: boolean) => {
    const validRoles = ['admin', 'super-user', 'SEO'];
    if( !validRoles.includes(session.user.role) ){
        return isApi ? noAutorizadoMessage: NextResponse.redirect(req.nextUrl.origin);
    }
    return NextResponse.next();
}