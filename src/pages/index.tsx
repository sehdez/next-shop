import { ShopLayout } from '@/components/layouts';
import { Typography } from '@mui/material';
import { useProducts } from '../hooks/useProducts';
import { FullScreenLoading, InfinityScroll } from '@/components/ui/';

const HomePage = () => {

    const { isError, isLoading, products, noMoreData, fetchData } = useProducts('/products');

    if (isError){
        return (<FullScreenLoading />)
    }
    

    return (
        <ShopLayout
            title='Shop - home'
            pageDescription='Encuentra los mejores productos'
        >
            <Typography variant='h1' component='h1' >Tienda</Typography>
            <Typography variant='h2' sx={{ mb: 1 }} >Todos los productos</Typography>
            
            <InfinityScroll 
                fetchData={fetchData}
                hasMore={!noMoreData}
                isLoading={isLoading}
                products={products}
            />


        </ShopLayout>
    )
}


export default HomePage
