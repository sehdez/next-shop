import { GetServerSideProps, NextPage } from 'next'
import { ShopLayout } from '@/components/layouts';
import { ProductList } from '@/components/products';
import { Box, Typography } from '@mui/material';
import { dbProducts } from '@/database';
import { IProduct } from '@/interfaces';
import { getAllProducts } from '../../database/dbProducts';


interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;

}

const SearchPage: NextPage<Props> = ({ products, query, foundProducts }) => {

    return (
        <ShopLayout
            title='Shop - search'
            pageDescription='Encuentra los mejores productos'
        >
            <Typography variant='h1' component='h1' >Buscar producto</Typography>
            {
                foundProducts
                    ? <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize' >{query}</Typography>
                    : (
                        <Box display='flex' >
                            <Typography variant='h2' sx={{ mb: 1 }} >No encontramos ningún producto</Typography>
                            <Typography variant='h2' sx={{ ml: 1 }} color='secondary' textTransform='capitalize' >{query}</Typography>
                        </Box>
                    )
            }

            <ProductList products={products} />
        </ShopLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query = '' } = params as { query: string }

    if (query.length == 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }
    let products = await dbProducts.getProductByTerm(query);
    const foundProducts = products.length > 0;

    if (!foundProducts) {
        products = await dbProducts.getAllProducts();
    }
    // TODO: regresar otros productos




    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage
