import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Card, CardContent, Divider, Grid, Typography } from '@mui/material'

import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { CartContext } from '@/context';
import { ButtonWithLoader } from '@/components/ui';

const CartPage = () => {
    const { isLoaded, numberOfItems } = useContext(CartContext);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)

    useEffect( ()=> {
        if( isLoaded && numberOfItems === 0 ){
            router.replace('/cart/empty')
        }
    }, [isLoaded, numberOfItems, router])

    if( !isLoaded && numberOfItems === 0){
        return(<></>)
    }
    return (
        <ShopLayout title='Carrito - 3' pageDescription={'Carrito de compras de la tienda'}>
            <Typography variant='h1' component='h1'>Carrito</Typography>

            <Grid container spacing={1}>
                <Grid item xs={12} md={7} >
                    <CartList editable />
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Orden</Typography>
                            <Divider sx={{ my: 1 }} />

                            {/* Order Summary */}
                            <OrderSummary />
                            <Box sx={{ mt: 3 }}>
                                <ButtonWithLoader 
                                    label='Checkout' 
                                    fullWidth
                                    isLoading={isLoading }
                                    onClick={() => {
                                        setIsLoading(true)
                                        router.push('/checkout/address')
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default CartPage