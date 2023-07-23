import { ShopLayout }  from '@/components/layouts';
import { Typography }  from '@mui/material';
import { useProducts } from '@/hooks/useProducts';
import { FullScreenLoading, InfinityScroll } from '@/components/ui';

const MenPage = () => {
    const { isError, isLoading, products, noMoreData, fetchData  } = useProducts('/products?gender=men');

    if (isError) return (<FullScreenLoading />)

    return (
        <ShopLayout
            title='Shop - men'
            pageDescription='Productos para hombres'
        >
            <Typography variant='h1' component='h1' >Hombres</Typography>
            <Typography variant='h2' sx={{ mb: 1 }} >Productos para hombres</Typography>
            
            <InfinityScroll
                fetchData={fetchData}
                hasMore={!noMoreData}
                isLoading={isLoading}
                products={products}
            />

        </ShopLayout>
    )
}

export default MenPage
