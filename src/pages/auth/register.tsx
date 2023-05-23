import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { Box, Button, Chip, CircularProgress, Grid, Link, TextField, Typography } from "@mui/material"
import { ErrorOutline } from '@mui/icons-material';

import { AuthLayout } from "@/components/layouts"
import { validations } from '@/utils';
import { shopApi } from '@/api';
import { AuthContext } from '../../context/auth/AuthContext';

type FormData = {
    name     : string;
    email    : string;
    password : string;
};

const RegisterPage = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const { registerUser } = useContext( AuthContext );
    const router = useRouter();
    const [msgError, setMsgError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onRegisterUser = async ({ email, password, name }: FormData) => {
        setMsgError('');
        setIsLoading(true)
        const { hasError, message } = await registerUser( name, email, password );
        if (hasError ){
            setMsgError( message! )
            setIsLoading(false)
            setTimeout(() => setMsgError(''), 4000)
            return
        }
        setIsLoading(false)
        
        const destination = router.query?.p?.toString() || '/';
        router.replace(destination);
    }

    return (
        <AuthLayout title='Ingresar'>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <form onSubmit={handleSubmit(onRegisterUser)} noValidate >
                    <Grid container spacing={2}>
                        <Grid item>
                            <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                            <Chip
                                label={ msgError }
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: msgError ? 'flex' : 'none' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                label='Nombre completo' 
                                type='text' 
                                variant='filled' 
                                fullWidth 
                                {...register('name',{
                                    required:'Este campo es requerido',
                                    minLength:{ value:5, message:'Es un nombre muy corto' }
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                label='Correo' 
                                type='email' 
                                variant='filled' 
                                fullWidth 
                                {...register('email',{
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>

                        <Grid item xs={12} >
                            <TextField 
                                label='Contraseña' 
                                type='password' 
                                variant='filled' 
                                fullWidth 
                                {...register('password',{
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type='submit'
                                color='secondary'
                                className="circular-btn"
                                size='large'
                                fullWidth
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? (<CircularProgress color="inherit" size={20} />)
                                    : ('Registrarse')
                                }
                            </Button>
                        </Grid>

                        <Grid item xs={12} justifyContent='end' display='flex'>
                            <NextLink href={`${router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login' }`} passHref legacyBehavior>
                                <Link underline='always'>
                                    ¿Ya tienes una cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </AuthLayout>
    )
}

export default RegisterPage