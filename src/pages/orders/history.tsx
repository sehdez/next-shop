import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link'
import { Chip, Grid, IconButton, Link, Typography } from '@mui/material'
import { CreditScoreOutlined, CreditCardOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { ShopLayout } from '@/components/layouts'
import { getSession } from 'next-auth/react';
import { dbOrders } from '@/database';
import { IOrder } from '../../interfaces/order';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si está pagada la orden o no.',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                params.row.paid
                    ? <Chip sx={{ my: 2 }} label='Pagada' variant='outlined' color='success' icon={<CreditScoreOutlined />} />
                    : <Chip sx={{ my: 2 }} label='No pagada' variant='outlined' color='error' icon={<CreditCardOffOutlined />} />
            )
        }
    },
    {
        field: 'order',
        headerName: 'Ver orden',
        width: 100,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref legacyBehavior>
                    <Link>
                        <IconButton>
                            <VisibilityOutlined />
                        </IconButton>
                    </Link>
                </NextLink>
            )
        }
    }
]

const buildRows = ( orders: IOrder[] ) => {
    return orders.map( (order, index)=> {
        return {
            id: index +1,
            paid: order.isPaid,
            fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
            orderId: order._id
        }
        
    } )
}
interface Props{
    orders: IOrder[];
}
const HistoryPage: NextPage<Props> = (props) => {
    const [orders, setOrders] = useState(buildRows(props.orders))
    return (
        <ShopLayout title='Historial de órdenes' pageDescription='Historial de ordenes del cliente'>
            <Typography variant='h1' component='h1'>Historial de las ordenes</Typography>

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={orders}
                        columns={columns}
                        pageSizeOptions={[25, 50, 100]}
                    />
                </Grid>
            </Grid>
        </ShopLayout>
    )
}
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

    const session: any = await getSession({ req })

    // Validar que este autenticado el usuario 
    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/history`,
                permanent: false
            }
        }
    }
    const orders = await dbOrders.getOrderByUser( session.user._id )


    return {
        props: {
            orders
        }
    }
}

export default HistoryPage