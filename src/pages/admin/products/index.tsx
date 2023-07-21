import { useEffect, useState } from 'react'
import NextLink                from 'next/link';
import useSWR                  from 'swr';

import { AddOutlined, CategoryOutlined }    from '@mui/icons-material';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Avatar, Box, Button, Link }        from '@mui/material';

import { DataTable, FullScreenLoading } from '@/components/ui';
import { AdminLayout }                  from '@/components/layouts'
import { IProduct }                     from '@/interfaces';

const ProductsPage = () => {

    const { data, error, isLoading } = useSWR<IProduct[]>('/api/admin/products');
    const [products, setProducts] = useState<IProduct[]>([])



    useEffect(() => {
        if (data) {
            setProducts(data)
        }
    }, [data])


    if (isLoading) {
        return <FullScreenLoading />
    }

    const columns: GridColDef[] = [
        {
            field: 'image',
            headerName: 'Imagen',
            width: 150,
            sortable: false,
            filterable: false,
            align:'center',
            headerAlign:'center',
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <a href={`/product/${row.slug}`} target='_blank'>
                        <Avatar
                            src={row.image}
                            sx={{ width: 90, height: 90, borderRadius: '50%' }}
                            alt={row.name}
                            className='fadeIn '
                        />
                    </a>
                )
            }
        },
        { 
            field: 'title', 
            headerName: 'Título', 
            width: 350, 
            maxWidth: 588, 
            minWidth: 200,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <NextLink href={`/admin/products/${row.slug}`} passHref legacyBehavior >
                        <Link underline='hover'>{ row.title }</Link>
                    </NextLink>
                )

            }
        },
        { field: 'gender',  headerName: 'Género' },
        { field: 'type',    headerName: 'Tipo' },
        { field: 'inStock', headerName: 'Inventario', align:'center', headerAlign:'center'},
        { field: 'price',   headerName: 'Precio' },
        { field: 'sizes',   headerName: 'Tallas', width:150 },
    ]

    const rows = products!.map(product => ({
        id      : product._id,
        image   : `${product.images[0]}`,
        title   : product.title,
        gender  : product.gender,
        type    : product.type,
        inStock : product.inStock,
        price   : `$${product.price}`,
        sizes   : product.sizes.join(', '),
        slug    : product.slug,
    }))


    return (
        <AdminLayout
            title={`Productos ( ${ products.length } )`}
            subtitle='Mantenimiento de productos'
            icon={<CategoryOutlined color='primary' />}
        >
            <Box display='flex' justifyContent='end' sx={{ mb:2, padding: 1 }} >
                <Button
                    startIcon={ <AddOutlined /> }
                    color='secondary'
                    href="/admin/products/new"
                >
                    Crear producto
                </Button>
                
            </Box>
            <DataTable
                title=''
                rowHeight={100}
                rows={rows}
                columns={columns}
            />
        </AdminLayout>
    )
}

export default ProductsPage