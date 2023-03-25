import NextLink from 'next/link';
import { AuthLayout } from "@/components/layouts"
import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material"

const RegisterPage = () => {
    return (
        <AuthLayout title='Ingresar'>
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={2}>
                    <Grid item>
                        <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label='Nombre completo' type='text' variant='filled' fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label='Correo' type='email' variant='filled' fullWidth />
                    </Grid>

                    <Grid item xs={12} >
                        <TextField label='Contraseña' type='password' variant='filled' fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <Button color='secondary' className="circular-btn" size='large' fullWidth>
                            Registrarse
                        </Button>
                    </Grid>

                    <Grid item xs={12} justifyContent='end' display='flex'>
                        <NextLink href='/auth/login' passHref legacyBehavior>
                            <Link underline='always'>
                                ¿Ya tienes una cuenta?
                            </Link>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </AuthLayout>
    )
}

export default RegisterPage