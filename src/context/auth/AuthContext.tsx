import { IUser } from '@/interfaces';
import { createContext } from 'react'

interface ContextProps {
    isLoggedIn: boolean;
    user?     : IUser; 
    // Métodos
    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean, message?: string }>;
}


export const AuthContext = createContext({} as ContextProps)