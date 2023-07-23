import { FC } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component'


import { IProduct } from '@/interfaces'
import { FullScreenLoading } from './FullScreenLoading';
import { ProductList } from '@/components/products';


interface Props{
    products: IProduct[];
    fetchData : () => Promise<void>
    hasMore : boolean;
    isLoading: boolean;
}

export const InfinityScroll: FC<Props> = ({ products, fetchData, hasMore, isLoading }) => {
    return (
        <InfiniteScroll
            style={{ overflow: 'hidden' }}
            dataLength={products.length} //This is important field to render the next data
            next={async () => await fetchData()}
            hasMore={hasMore}
            loader={
                <Grid
                    container
                    sx={{ display: 'flex', justifyContent: 'center' }}
                >
                    <CircularProgress color='inherit' sx={{ alignSelf: 'center' }} size={20} />

                </Grid>
            }
        // endMessage={
        //     <p style={{ textAlign: 'center' }}>
        //         <b>Yay! You have seen it all</b>
        //     </p>
        // }
        >
            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }


        </InfiniteScroll>
    )
}
