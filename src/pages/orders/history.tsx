import NextLink from 'next/link'
import { Chip, Grid, IconButton, Link, Typography } from '@mui/material'
import { CreditScoreOutlined, CreditCardOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { ShopLayout } from '@/components/layouts'

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
                <NextLink href={`/orders/${params.row.id}`} passHref legacyBehavior>
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

const rows = [
    { id: 1, paid: true, fullname: 'Sergio Hernández', },
    { id: 2, paid: false, fullname: 'David Cuevas', },
    { id: 3, paid: true, fullname: 'Patricia Cuevas', },
    { id: 4, paid: false, fullname: 'Francisco Vera', },
    { id: 5, paid: true, fullname: 'Javier Hernandez', },
]
const HistoryPage = () => {
    return (
        <ShopLayout title='Historial de órdenes' pageDescription='Historial de ordenes del cliente'>
            <Typography variant='h1' component='h1'>Historial de las ordenes</Typography>

            <Grid container>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[25, 50, 100]}
                    />
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default HistoryPage