import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { Typography } from '@mui/material';
import { useProducts } from '../../hooks/useProducts';
import { FullScreenLoading } from '../../components/ui';

const WomenPage = () => {
    const { isError, isLoading, products } = useProducts('/products?gender=women');

    if (isError) return <div>failed to load</div>
    // if (isLoading) return <div>loading...</div>

    return (
        <ShopLayout
            title='Shop - women'
            pageDescription='Productos para mujeres'
        >
            <Typography variant='h1' component='h1' >Mujeres</Typography>
            <Typography variant='h2' sx={{ mb: 1 }} >Productos para mujeres</Typography>
            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }


        </ShopLayout>
    )
}


export default WomenPage
