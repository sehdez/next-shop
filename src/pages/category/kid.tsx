import { ShopLayout }  from '@/components/layouts';
import { Typography }  from '@mui/material';
import { useProducts } from '../../hooks/useProducts';
import { FullScreenLoading, InfinityScroll } from '@/components/ui';

const KidPage = () => {
    const { isError, isLoading, products, noMoreData, fetchData } = useProducts('/products?gender=kid');

    if (isError) return (<FullScreenLoading />)

    return (
        <ShopLayout
            title='Shop - kid'
            pageDescription='Productos para niños'
        >
            <Typography variant='h1' component='h1' >Niños</Typography>
            <Typography variant='h2' sx={{ mb: 1 }} >Productos para niños</Typography>

            <InfinityScroll
                fetchData={fetchData}
                hasMore={!noMoreData}
                isLoading={isLoading}
                products={products}
            />
        </ShopLayout>
    )
}


export default KidPage
