import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';

import { ShopLayout } from '@/components/layouts';
import { countries } from '@/utils';
import Cookies from 'js-cookie';
import { CartContext } from '@/context';

type FormData = {
    firstName : string;
    lastName  : string;
    address   : string;
    address2? : string;
    zipCode   : string;
    city      : string;
    country   : string;
    phone     : string;

}
const getAddressFromCookies = (): FormData => {
    return {
        firstName : Cookies.get('firstName') || '',
        lastName  : Cookies.get('lastName')  || '',
        address   : Cookies.get('address')   || '',
        address2  : Cookies.get('address2')  || '',
        zipCode   : Cookies.get('zipCode')   || '',
        city      : Cookies.get('city')      || '',
        country   : Cookies.get('country')   || '',
        phone     : Cookies.get('phone')     || ''
    }
}
const AddressPage = () => {
    const router = useRouter();
    const { updateAddress } = useContext(CartContext)

    const [defaultCountry, setDefaultCountry] = useState('')

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });
    const onSubmit = ( data: FormData ) => {
        updateAddress(data)
        router.push('/checkout/summary')
    }

    // getAddressFromCookies() retorna el valor guadado en las cookies
    useEffect(() => {
        const address = getAddressFromCookies()
        reset(address)
        setDefaultCountry(address.country)
    }, [reset])

    return (
        <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>
            <form onSubmit={ handleSubmit(onSubmit) }>
                <Typography variant='h1' component='h1'>Dirección</Typography>

                <Grid container spacing={2} marginTop={2}>


                    <Grid item xs={12} md={6}>
                        <TextField 
                            label='Nombre' 
                            variant='filled' 
                            fullWidth 
                            {
                                ...register('firstName',{
                                    required: 'Este campo es requerido',
                                    minLength: { value: 4, message:'Muy corto el valor' }
                            })}
                            error={ !!errors.firstName }
                            helperText={ errors.firstName?.message }
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <TextField 
                            label='Apellido' 
                            variant='filled' 
                            fullWidth 
                            {
                                ...register('lastName',{
                                    required: 'Este campo es requerido',
                                    minLength: { value: 4, message:'Muy corto el valor' }
                            })}
                            error={ !!errors.lastName }
                            helperText={ errors.lastName?.message }
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <TextField 
                            label='Dirección' 
                            variant='filled' 
                            fullWidth 
                            {
                                ...register('address',{
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message:'Muy corto el valor' }
                            })}
                            error={ !!errors.address }
                            helperText={ errors.address?.message }
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <TextField 
                            label='Dirección 2 (opcional)' 
                            variant='filled' 
                            fullWidth 
                            {
                                ...register('address2')
                            }
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <TextField 
                            label='Código Postal' 
                            variant='filled' 
                            fullWidth 
                            {
                                ...register('zipCode',{
                                    required: 'Este campo es requerido',
                                    minLength: { value: 5, message:'Muy corto el valor' }
                            })}
                            error={ !!errors.zipCode }
                            helperText={ errors.zipCode?.message }
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <TextField 
                            label='Ciudad' 
                            variant='filled' 
                            fullWidth 
                            {
                                ...register('city',{
                                    required: 'Este campo es requerido',
                                    minLength: { value: 3, message:'Muy corto el valor' }
                            })}
                            error={ !!errors.city }
                            helperText={ errors.city?.message }
                        />
                    </Grid>


                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <TextField
                                select
                                variant='filled'
                                label='País'
                                key={defaultCountry}
                                defaultValue={ defaultCountry }
                                {
                                ...register('country', {
                                    required: 'Este campo es requerido',
                                })}
                                error={!!errors.country}
                                // helperText
                            >
                                {countries.map(( country, index ) => (
                                    <MenuItem key={ country.code + index } value={ country.code }>{ country.name }</MenuItem>

                                ))}
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            type='number'
                            label='Teléfono' 
                            variant='filled' 
                            fullWidth 
                            {
                                ...register('phone',{
                                    required: 'Este campo es requerido',
                                    minLength: { value: 10, message:'Muy corto el valor' }
                            })}
                            error={ !!errors.phone }
                            helperText={ errors.phone?.message }
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                    <Button 
                        type='submit'
                        color='secondary' 
                        className='circular-btn' 
                        size='large'
                    >
                        Revisar Pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    )
}

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {

//     const { token = '' } = req.cookies;
//     let isValidToken = false;
//     try {
//         await jwt.isValidToken(token);
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if(!isValidToken){
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {

//         }
//     }
// }

export default AddressPage
