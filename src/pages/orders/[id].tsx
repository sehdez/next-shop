import { getSession } from 'next-auth/react';
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { PayPalButtons } from "@paypal/react-paypal-js";

import { CartList, OrderSummary } from '@/components/cart'
import { ShopLayout } from '@/components/layouts'
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { shopApi } from '@/api';
import { useState } from 'react';
import { AlertSnackbar } from '@/components/ui';

interface Props {
    order: IOrder
} 

type OrderResponseBody = {
    id: string;
    status: 
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED"
};


const OrderPage: NextPage<Props> = ({ order }) => {

    const router = useRouter()
    const [isPaying, setIsPaying] = useState(false)
    const [alertSnack, setAlertSnack] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const { shippingAddress } = order;
    const onOrderCompleted = async (details: OrderResponseBody ) => {
        if( details.status !== 'COMPLETED' ){
            return setAlertSnack({
                open: true,
                message: 'No hay pago en paypal',
                severity: 'error',
            });
        }
        setIsPaying(true);

        try {
            const { data } = await shopApi.post('/orders/pay',{
                transactionId: details.id,
                orderId: order._id
            }) 
            router.reload()
        } catch (error) {
            console.log(error);
            setAlertSnack({
                open: true,
                message: 'Ocurrió un error',
                severity: 'error',
            })
            setIsPaying(true);

        }

    }
    return (
        <ShopLayout title='Resumen de la orden' pageDescription={'Resumen de la órden'}>
            <Typography variant='h1' component='h1'>Orden: { order._id }</Typography>
            <AlertSnackbar
                alertSnackbar={alertSnack}
                setAlertSnackbar={setAlertSnack}
            />

            {
                order.isPaid 
                    ? (<Chip
                        sx={{ my: 2 }}
                        label='Pagada'
                        variant='outlined'
                        color='success'
                        icon={<CreditScoreOutlined />}
                    />)
                    : (<Chip
                        sx={{ my: 2 }}
                        label='Pendiente de pago'
                        variant='outlined'
                        color='error'
                        icon={<CreditCardOffOutlined />}
                    /> )
            }
            
            
            <Grid container spacing={1} className='fadeIn'>
                <Grid item xs={12} md={7} >
                    <CartList products={ order.orderItems } />
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({ order.numberOfItems } { order.numberOfItems > 1 ? 'Productos' : 'Producto' } )</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Typography >{ shippingAddress?.firstName} { shippingAddress?.lastName }</Typography>
                            <Typography >{ shippingAddress.address}{shippingAddress.address2 && ', ' + shippingAddress.address2 }</Typography>
                            <Typography >{ shippingAddress.city}, {shippingAddress.zipCode}</Typography>
                            <Typography >{ shippingAddress.country }</Typography>
                            <Typography >{ shippingAddress.phone }</Typography>

                            <Divider sx={{ my: 1 }} />
                            
                            {/* Order Summary */}
                            <OrderSummary orderFromBackend={ order } />

                            <Box sx={{ mt: 3, display:'flex', flexDirection:'column' }}>
                                <Box 
                                    display={isPaying ? 'flex' : 'none'} 
                                    justifyContent='center'>
                                    <CircularProgress/>
                                </Box>
                                <Box sx={{ display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection='column'>

                                    {
                                        order.isPaid
                                            ? (<Chip
                                                sx={{ my: 2 }}
                                                label='la orden ya fue pagada'
                                                variant='outlined'
                                                color='success'
                                                icon={<CreditScoreOutlined />}
                                                />)
                                            : (<PayPalButtons
                                                createOrder={(data, actions) => {
                                                    
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: `${order.total}`,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture().then((details) => {
                                                        onOrderCompleted(details as OrderResponseBody)
                                                        // const name = details?.payer?.name?.given_name;
                                                        
                                                    });
                                                }}
                                            />)
                                    }
                                </Box>
                                
                                
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;
    const session: any = await getSession({ req })

    // Validar que este autenticado el usuario 
    if(!session){
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${ id }`,
                permanent: false
            }
        }
    }
    // validar que exista la orden
    const order = await dbOrders.getOrderById( id.toString() )
    if(!order){
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }

    //Validar que la order corresponde al usuario
    if (order.user !== session.user?._id) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage