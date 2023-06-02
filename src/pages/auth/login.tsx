import { GetServerSideProps } from 'next'
import { getSession, signIn, getProviders } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useForm } from "react-hook-form";
import { Box, Button, Chip, CircularProgress, Divider, Grid, IconButton, Link, TextField, Typography } from "@mui/material"

import { AuthLayout } from "@/components/layouts"
import { validations } from '@/utils';
import { ErrorOutline, GitHub, Google, Image } from '@mui/icons-material';

type FormData = {
    email: string,
    password: string,
};


const LoginPage = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const router = useRouter();
    const [ showError, setShowError ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);

    const [providers, setProviders] = useState<any>({})

    useEffect(()=> {
        const { error } = router.query
        if(error) {
            setShowError(true)
            setTimeout(() => setShowError(false), 4000)
        }
    }, [])

    useEffect( ()=> {
        getProviders().then( prov => {
            setProviders(prov)
        })
    },[])

    const onLoginUser = async ( { email, password }: FormData ) => {
        
        setShowError(false)
        setIsLoading(true)

        await signIn( 'credentials', { email, password } )
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

                    <Grid item xs={ 12 } display='flex' flexDirection='column' justifyContent='end'>
                        {/* <Divider  /> */}
                        <Divider 
                            orientation="horizontal" 
                            flexItem
                            sx={{ width: '100%', mb: 4, mt:2 }}
                            >
                             O inicia sesión con 
                        </Divider>
                        
                            {
                            Object.values( providers ).map( (provider: any)=> {
                                if( provider.id === 'credentials' ) return null
                                return(
                                    <Button
                                        key={ provider.id }
                                        variant='outlined'
                                        fullWidth
                                        color='primary'
                                        sx={{ mb:1, pt:1, pb:1 }}
                                        onClick={ () => signIn(provider.id) }
                                    >
                                        
                                            {
                                                provider.id === 'google' 
                                                ? (<Google />)
                                                : provider.id === 'github' 
                                                ? ( <GitHub /> )
                                                : <></>
                                            }
                                        <Typography variant='body1' sx={{ ml:1, fontWeight:500 }} > {provider.name} </Typography>
                                        

                                    </Button>
                                )})
                            }
                    </Grid>

                </Box>
            </form>
        </AuthLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const session = await getSession({ req })

    const { p = '/'} = query;

    if( session ){
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }


    return {
        props: {
            
        }
    }
}

export default LoginPage