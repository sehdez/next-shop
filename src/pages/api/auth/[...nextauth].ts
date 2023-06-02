import NextAuth, { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google";
import Credentials from 'next-auth/providers/credentials';

import { dbUsers } from '@/database'
import { jwt } from '@/utils';

// export const authOptions = 
export const authOption: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        Credentials({
            name: 'Custom Login',
            credentials: {
                email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com' },
                password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' }
            },
            async authorize(credentials) {
                return await dbUsers.checkEmailPassword(credentials?.email, credentials?.password) as any
            }
        }),

        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        })
        // ...add more providers here
    ],
    // custom pages
    pages: {
        signIn: '/auth/login',
        newUser: 'auth/register'
    },
    jwt: {

    },

    session:{
        maxAge: 2592000, // 30 días
        strategy: 'jwt',
        updateAge: 86400 // cada día se va actualizar
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token

                switch (account.type) {
                    case 'oauth':
                        token.user = await dbUsers.oAuthDbUser( user?.email!, user?.name! );
                        break;
                    case 'credentials':
                        token.user = user;
                        break;
                }
            }
            return token
        },
        async session({ session, token, user }) {
            session.user = token.user as any
            return session
        }
    }
}

export default NextAuth(authOption)