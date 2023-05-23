import { useRouter } from 'next/router';
import { FC, useReducer, PropsWithChildren, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import { IUser } from '../../interfaces/user';
import { AuthContext, authReducer } from './';
import { shopApi } from '@/api';

export interface AuthState {
    isLoggedIn: boolean;
    user?     : IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user      : undefined
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

    const router = useRouter();

    const loginUser = async ( email:string, password: string ): Promise<boolean> => {

        try {
            const { data } = await shopApi.post('/user/login', { email, password })
            const { token, user } = data;
            Cookies.set('token', token)
            dispatch({ type: '[AUTH] - Login', payload: user })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const registerUser = async (name: string, email: string, password: string ): Promise<{ hasError: boolean; message?: string }> => {
        try {
            const { data } = await shopApi.post('/user/register', { email, password, name })
            const { token, user } = data;
            Cookies.set('token', token)
            dispatch({ type: '[AUTH] - Login', payload: user })
            return {
                hasError: false
            }

        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }
            return {
                hasError: true,
                message : 'No se pudo crear el usuario - intente de nuevo'
            }
        }
    }

    const logout = () => {
        Cookies.remove('token');
        Cookies.remove('cart');
        router.reload();
    }

    const validateToken = async () => {
        const token = Cookies.get('token')
        if(!token) return;
        try{
            const { data } = await shopApi.get('/user/refresh-token');
            const { token, user } = data;
            Cookies.set('token', token)
            dispatch({ type: '[AUTH] - Login', payload: user })
        }catch(error){
            Cookies.remove('token')
        }

    }
    useEffect(() => {
        validateToken()
    }, [])
    return (
        <AuthContext.Provider value={{
            ...state,

            //Metods
            loginUser,
            registerUser,
            logout
        }}
        >
            {children}
        </AuthContext.Provider >
    )
}