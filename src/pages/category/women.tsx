import { ShopLayout }  from '@/components/layouts';
import { Typography }  from '@mui/material';
import { useProducts } from '../../hooks/useProducts';
import { FullScreenLoading, InfinityScroll } from '../../components/ui';

const WomenPage = () => {
    const { isError, isLoading, products, noMoreData, fetchData } = useProducts('/products?gender=women');

    if (isError) return (<FullScreenLoading />)

    return (
        <ShopLayout
            title='Shop - women'
            pageDescription='Productos para mujeres'
        >
            <Typography variant='h1' component='h1' >Mujeres</Typography>
            <Typography variant='h2' sx={{ mb: 1 }} >Productos para mujeres</Typography>
            
            
            <InfinityScroll
                fetchData={fetchData}
                hasMore={!noMoreData}
                isLoading={isLoading}
                products={products}
            />

        </ShopLayout>
    )
}


export default WomenPage
