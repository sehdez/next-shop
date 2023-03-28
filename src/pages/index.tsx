import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { Typography } from '@mui/material';
import { initialData } from '../database/products';


const index = () => {
    return (
        <ShopLayout
            title='Shop - home'
            pageDescription='Encuentra los mejores productos'
        >
            <Typography variant='h1' component='h1' >Tienda</Typography>
            <Typography variant='h2' sx={{ mb: 1 }} >Todos los productos</Typography>

            <ProductList products={initialData.products as any} />

        </ShopLayout>
    )
}


export default index
