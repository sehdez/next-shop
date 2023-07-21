import { useState }                     from 'react';
import { getSession }                   from 'next-auth/react';
import { GetServerSideProps, NextPage } from 'next';
import NextLink                         from 'next/link'

import { Chip, IconButton, Link } from '@mui/material'
import { 
    CreditScoreOutlined, 
    CreditCardOffOutlined, 
    VisibilityOutlined } from '@mui/icons-material';
import {  GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import { ShopLayout } from '@/components/layouts'
import { dbOrders }   from '@/database';
import { IOrder }     from '../../interfaces/order';
import { DataTable }  from '@/components/ui';
import { useWidthColumns } from '../../utils/useWidthColumns';



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
    const [ column1, column2 ] = useWidthColumns();
    
    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100, align: 'center', headerAlign: 'center', },
        { field: 'fullname', headerName: 'Nombre Completo', width: column1, maxWidth: 588, minWidth: 200 },
        {
            field: 'paid',
            headerName: 'Pagada',
            description: 'Muestra información si está pagada la orden o no.',
            width: column2,
            maxWidth: 588, 
            minWidth: 200,
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
            align: 'center',
            headerAlign: 'center',
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
    return (
        <ShopLayout title='Historial de órdenes' pageDescription='Historial de ordenes del cliente'>
            <DataTable 
                title='Historial de las ordenes' 
                columns={ columns } 
                rows={ orders }  
            />
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