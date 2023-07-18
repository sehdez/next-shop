import React from 'react'
import { AdminLayout } from '@/components/layouts'
import { ConfirmationNumberOutlined, VisibilityOutlined } from '@mui/icons-material'
import { Chip, Grid, IconButton } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useSWR from 'swr';
import { IOrder } from '../../interfaces/order';
import { FullScreenLoading } from '../../components/ui';
import { IUser } from '@/interfaces'
import { dateFns } from '@/utils'

const OrderPage = () => {

    const { data, error, isLoading } = useSWR<IOrder[]>('/api/admin/orders');

    if (isLoading ){
        return (<FullScreenLoading/>)
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Orden ID', width: 150 },
        { field: 'name', headerName: 'Nombre Completo', width: 200, maxWidth: 588, minWidth: 200 },
        { field: 'email', headerName: 'Correo', width: 200, maxWidth: 588, minWidth: 200 },
        { field: 'createdAt', headerName: 'Creada', width: 150, maxWidth: 588, minWidth: 200 },
        { field: 'total', headerName: 'Monto total', width: 10, maxWidth: 588, minWidth: 200 },
        {
            field: 'isPaid',
            headerName: 'Estatus',
            width: 120,
            filterable: false,
            renderCell: ({ row }: GridRenderCellParams) => {
                return row.isPaid
                    ? (<Chip variant='outlined' label='Pagada' color='success' />)
                    : (<Chip variant='outlined' label='Pendiente' color='error' />)
            }
        },
        { field: 'noProducts', headerName: 'No. Productos', align:'center'},
        {
            field: 'check',
            headerName: 'Ver Orden',
            width: 100,
            filterable: false,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <a href={`/admin/orders/${ row.id }`} target='_blank' >
                        <IconButton>
                            <VisibilityOutlined />
                        </IconButton>
                    </a>
                )
            }
        },
    ]

    const rows = data!.map(order => ({
        id         : order._id,
        name       : (order.user as IUser)?.name,
        email      : (order.user as IUser)?.email,
        total      : `$${order.total}`,
        isPaid     : order.isPaid,
        noProducts : order.numberOfItems,
        createdAt  : dateFns.formatDate(order.createdAt!)
    }))

    return (
        <AdminLayout
            title='Ordenes'
            subtitle='Mantenimiento de órdenes'
            icon={<ConfirmationNumberOutlined />}
        >
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 850    , width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[25, 50, 100]}
                    />
                </Grid>
            </Grid>

        </AdminLayout>   
    )
}

export default OrderPage