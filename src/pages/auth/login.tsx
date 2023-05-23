import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useForm } from "react-hook-form";
import { Box, Button, Chip, CircularProgress, Grid, Link, TextField, Typography } from "@mui/material"

import { AuthLayout } from "@/components/layouts"
import { validations } from '@/utils';
import shopApi from '../../api/shopApi';
import { ErrorOutline } from '@mui/icons-material';
import { AuthContext } from '@/context';


type FormData = {
    email: string,
    password: string,
};


const LoginPage = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const router = useRouter();
    const [ showError, setShowError ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const { loginUser } = useContext(AuthContext)

    const onLoginUser = async ( { email, password }: FormData ) => {
        
        setShowError(false)
        setIsLoading(true)

        const isValidLoggin = await loginUser( email, password )

        if( !isValidLoggin ){
            setShowError(true)
            setIsLoading(false)
            setTimeout(() => setShowError(false), 4000)
            return
        }
        setIsLoading(false)

        const destination = router.query?.p?.toString() || '/';
        router.replace(destination);
    }

    return (
        <AuthLayout title='Ingresar'>
            <form onSubmit={ handleSubmit( onLoginUser ) } noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
                            <Chip
                                label= 'No se reconoce el usuario/contraseña'
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                                sx={{display: showError ? 'flex' : 'none'}}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                label='Correo' 
                                type='email' 
                                variant='filled' 
                                fullWidth 
                                {
                                    ...register('email', {
                                        required: 'Este campo es requerido',
                                        validate: validations.isEmail
                                })}
                                error={ !!errors.email }
                                helperText={ errors.email?.message }
                            />
                        </Grid>

                        <Grid item xs={12} >
                            <TextField 
                                label='Contraseña' 
                                type='password' 
                                variant='filled' 
                                fullWidth 
                                {
                                    ...register('password', {
                                        required: 'Este campo es requerido',
                                        minLength: { value: 6, message:'Minimo 6 caracteres' }
                                    })
                                }
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type='submit'
                                color='secondary' 
                                disabled={ isLoading }
                                className="circular-btn" 
                                size='large' 
                                fullWidth
                            >
                                { isLoading 
                                    ? (<CircularProgress color="inherit" size={20} />) 
                                    : ('Enviar')
                                }
                            </Button>
                        </Grid>

                        <Grid item xs={12} justifyContent='end' display='flex'>
                            <NextLink href={`${router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'}`} passHref legacyBehavior>
                                <Link underline='always'>
                                    ¿No tienes Cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default LoginPage