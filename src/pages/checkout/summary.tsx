import { useContext } from 'react';
import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material'

import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { CartContext } from '@/context';
import { countries } from '@/utils';

const SummaryPage = () => {
    const { shippingAddress, numberOfItems } = useContext( CartContext )
    
    if( !shippingAddress ){
        return <></>
    }

    const { firstName,
            lastName,
            address,
            address2 = '',
            city,
            zipCode,
            country,
            phone } = shippingAddress;

    return (
        <ShopLayout title='Resumen de orden' pageDescription={'Resumen de la órden'}>
            <Typography variant='h1' component='h1'>Carrito</Typography>

            <Grid container spacing={1}>
                <Grid item xs={12} md={7} >
                    <CartList />
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItems}) producto{numberOfItems > 1 && 's' }</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref legacyBehavior>
                                    <Link underline='always'>Editar</Link>
                                </NextLink>
                            </Box>

                            <Typography >{ firstName + ' ' + lastName  }</Typography>
                            <Typography >{ address }{ address2 && `, ${ address2 }`  }</Typography>
                            <Typography >{ city + ' ' + zipCode }</Typography>
                            <Typography >{ countries.find(el => el.code === country )?.name  }</Typography>
                            <Typography >{ phone }</Typography>

                            <Divider sx={{ my: 1 }} />
                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref legacyBehavior>
                                    <Link underline='always'>Editar</Link>
                                </NextLink>
                            </Box>
                            {/* Order Summary */}
                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                <Button color='secondary' className='circular-btn' fullWidth>
                                    Confirmar orden
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage