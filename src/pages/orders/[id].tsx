import NextLink from 'next/link';
import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

const OrderPage = () => {
    return (
        <ShopLayout title='Resumen de la orden 123' pageDescription={'Resumen de la órden'}>
            <Typography variant='h1' component='h1'>Orden: 1234</Typography>

            {/* <Chip
                sx={{ my: 2 }}
                label='Pendiente de pago'
                variant='outlined'
                color='error'
                icon={<CreditCardOffOutlined />}
            /> */}
            <Chip
                sx={{ my: 2 }}
                label='Pagada'
                variant='outlined'
                color='success'
                icon={<CreditScoreOutlined />}
            />
            <Grid container spacing={1}>
                <Grid item xs={12} md={7} >
                    <CartList />
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen (3 productos)</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref legacyBehavior>
                                    <Link underline='always'>Editar</Link>
                                </NextLink>
                            </Box>

                            <Typography >Sergio Hernández</Typography>
                            <Typography >Loma Jazmin #35</Typography>
                            <Typography >Loma Bonita, 45694</Typography>
                            <Typography >México</Typography>
                            <Typography >+52 3334812449</Typography>

                            <Divider sx={{ my: 1 }} />
                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/checkout/address' passHref legacyBehavior>
                                    <Link underline='always'>Editar</Link>
                                </NextLink>
                            </Box>
                            {/* Order Summary */}
                            <OrderSummary />

                            <Box sx={{ mt: 3 }}>
                                {/* <Chip
                                    sx={{ my: 2 }}
                                    label='Pendiente de pago'
                                    variant='outlined'
                                    color='error'
                                    icon={<CreditCardOffOutlined />}
                                /> */}
                                <Chip
                                    sx={{ my: 2 }}
                                    label='Pagada'
                                    variant='outlined'
                                    color='success'
                                    icon={<CreditScoreOutlined />}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default OrderPage