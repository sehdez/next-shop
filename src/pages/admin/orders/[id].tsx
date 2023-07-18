import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material'
import { ConfirmationNumberOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { CartList, OrderSummary } from '@/components/cart'
import { AdminLayout } from '@/components/layouts'
import { dbOrders } from '@/database';
import { IOrder } from '@/interfaces';
import { shopApi } from '@/api';

interface Props {
    order: IOrder
}

const OrderPage: NextPage<Props> = ({ order }) => {

    const { shippingAddress } = order;
    
    return (
        <AdminLayout title='Resumen de la orden' subtitle='' icon={<ConfirmationNumberOutlined />}>

            <Typography variant='h1' component='h1'>Orden: {order._id}</Typography>
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
                    />)
            }

            <Grid container spacing={1} className='fadeIn'>
                <Grid item xs={12} md={7} >
                    <CartList products={order.orderItems} />
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'Productos' : 'Producto'} )</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Typography >{shippingAddress?.firstName} {shippingAddress?.lastName}</Typography>
                            <Typography >{shippingAddress.address}{shippingAddress.address2 && ', ' + shippingAddress.address2}</Typography>
                            <Typography >{shippingAddress.city}, {shippingAddress.zipCode}</Typography>
                            <Typography >{shippingAddress.country}</Typography>
                            <Typography >{shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            {/* Order Summary */}
                            <OrderSummary orderFromBackend={order} />

                            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column' }}>

                                <Box sx={{ display: 'flex', flex: 1 }} flexDirection='column'>

                                    {
                                        order.isPaid
                                            ? (<Chip
                                                sx={{ my: 2 }}
                                                label='La orden ya fue pagada'
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
                                            
                                            />
                                        )
                                    }
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    )
}
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const { id = '' } = query;

    const order = await dbOrders.getOrderById(id.toString())

    if (!order) {
        return {
            redirect: {
                destination: '/admin/orders',
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