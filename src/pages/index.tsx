import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { Typography } from '@mui/material';
import { useProducts } from '../hooks/useProducts';
import { FullScreenLoading } from '../components/ui/';

const HomePage = () => {

    const { isError, isLoading, products } = useProducts('/products');

    if (isError) return <div>failed to load</div>
    // if (isLoading) return <div>loading...</div>

    return (
        <ShopLayout
            title='Shop - home'
            pageDescription='Encuentra los mejores productos'
        >
            <Typography variant='h1' component='h1' >Tienda</Typography>
            <Typography variant='h2' sx={{ mb: 1 }} >Todos los productos</Typography>
            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }


        </ShopLayout>
    )
}


export default HomePage
