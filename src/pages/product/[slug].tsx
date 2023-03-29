import { GetServerSideProps, NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { ShopLayout } from '@/components/layouts'
import { ProductSlideShow, SizeSelector } from '@/components/products';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { initialData } from '../../database/products'
import { ItemCounter } from '@/components/ui';
import { IProduct } from '../../interfaces/products';
import 'react-slideshow-image/dist/styles.css'
import { dbProducts } from '@/database';

// const product = initialData.products[0];

interface props {
    product: IProduct;
}

const ProductPage: NextPage<props> = ({ product }) => {

    // Desesctructuramos el slug de los query params
    // const { query: { slug } } = useRouter();
    // const { products: product, isError, isLoading } = useProducts(`/products/${slug}`);

    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    {/* Slideshow */}
                    <ProductSlideShow images={product.images} />
                </Grid>

                <Grid item xs={12} sm={5}>
                    <Box display='felx' flexDirection='column'>
                        {/* títulos */}
                        <Typography variant='h1' component='h1'>{product.title}</Typography>
                        <Typography variant='subtitle1' component='h2'>${product.price}</Typography>

                        {/* cantidad */}
                        <Box sx={{ my: 2 }}>
                            <Typography variant='subtitle2'>Cantidad</Typography>

                            {/* itemCounter */}
                            <ItemCounter />
                            <SizeSelector selectedSize={product.sizes[0]} sizes={product.sizes} />
                        </Box>

                        {/* Agregar al carrito */}
                        <Button color='secondary' className='circular-btn' fullWidth>
                            Agregar al carrito
                        </Button>

                        {/* <Chip label='No hay disponibles' color='error' variant='outlined' /> */}

                        {/* descripcion */}

                        <Box sx={{ mt: 3 }}>
                            <Typography variant='subtitle2'>Descripción</Typography>
                            <Typography variant='body2'>{product.description}</Typography>
                        </Box>
                    </Box>
                </Grid>

            </Grid>
        </ShopLayout>
    )
}

// Una forma de hacerlo también
// export const getServerSideProps: GetServerSideProps = async ({ params }) => {

//     const { slug = '' } = params as { slug: string };

//     const product = await dbProducts.getProductBySlug(slug);

//     if (!product) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {
//             product
//         }
//     }
// }

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes


export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const products = await dbProducts.getAllProductSlug();

    return {
        paths: products.map(({ slug }) => ({
            params: { slug }
        })),
        fallback: "blocking"
    }
}
export const getStaticProps: GetStaticProps = async ({ params }) => {

    const { slug = '' } = params as { slug: string }

    const product = await dbProducts.getProductBySlug(slug)

    if (!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            product
        },
        revalidate: 60 * 60 * 24
    }
}

export default ProductPage
