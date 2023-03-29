import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { Typography } from '@mui/material';
import { useProducts } from '../../hooks/useProducts';
import { FullScreenLoading } from '../../components/ui';

const KidPage = () => {
    const { isError, isLoading, products } = useProducts('/products?gender=kid');

    if (isError) return <div>failed to load</div>
    // if (isLoading) return <div>loading...</div>

    return (
        <ShopLayout
            title='Shop - kid'
            pageDescription='Productos para niños'
        >
            <Typography variant='h1' component='h1' >Niños</Typography>
            <Typography variant='h2' sx={{ mb: 1 }} >Productos para niños</Typography>
            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }


        </ShopLayout>
    )
}


export default KidPage
