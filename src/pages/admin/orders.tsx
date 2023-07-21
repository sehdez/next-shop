import { ConfirmationNumberOutlined, VisibilityOutlined } from '@mui/icons-material'
import { GridColDef, GridRenderCellParams }     from '@mui/x-data-grid'
import { Chip, IconButton }                         from '@mui/material'

import useSWR from 'swr';

import { DataTable, FullScreenLoading } from '@/components/ui';
import { AdminLayout } from '@/components/layouts'
import { IOrder }      from '@/interfaces/order';
import { IUser }       from '@/interfaces'
import { dateFns }     from '@/utils'

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
            <DataTable
                title=''
                rows={rows}
                columns={columns}
            />

        </AdminLayout>   
    )
}

export default OrderPage