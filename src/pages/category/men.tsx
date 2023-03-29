import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { Typography } from '@mui/material';
import { useProducts } from '../../hooks/useProducts';
import { FullScreenLoading } from '../../components/ui/';

const MenPage = () => {
    const { isError, isLoading, products } = useProducts('/products?gender=men');

    if (isError) return <div>failed to load</div>
    // if (isLoading) return <div>loading...</div>

    return (
        <ShopLayout
            title='Shop - men'
            pageDescription='Productos para hombres'
        >
            <Typography variant='h1' component='h1' >Hombres</Typography>
            <Typography variant='h2' sx={{ mb: 1 }} >Productos para hombres</Typography>
            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }


        </ShopLayout>
    )
}


export default MenPage
