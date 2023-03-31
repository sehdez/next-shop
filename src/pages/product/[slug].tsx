import { useContext, useState } from 'react';
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import 'react-slideshow-image/dist/styles.css'

import { ShopLayout } from '@/components/layouts'
import { ProductSlideShow, SizeSelector } from '@/components/products';
import { ItemCounter } from '@/components/ui';
import { IProduct, ICartProduct } from '../../interfaces/';
import { dbProducts } from '@/database';
import { ISize } from '../../interfaces/products';
import { CartContext } from '../../context/cart/CartContext';
import { useRouter } from 'next/router';

// const product = initialData.products[0];

interface props {
    product: IProduct;
}

const ProductPage: NextPage<props> = ({ product }) => {

    const { addProductToCart, cart } = useContext(CartContext)
    const { push } = useRouter()
    const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        description: product.description,
        image: product.images[0],
        inStock: product.inStock,
        price: product.price,
        size: undefined,
        slug: product.slug,
        tags: product.tags,
        title: product.title,
        gender: product.gender,
        quantity: 1
    })
    const onSelectedSize = (size: ISize) => {
        setTempCartProduct({ ...tempCartProduct, size })
    }

    const updatedQuantity = (quantity: number) => {
        setTempCartProduct({ ...tempCartProduct, quantity: tempCartProduct.quantity + quantity })
    }
    const onAddProduct = () => {
        if (!tempCartProduct.size) return;

        addProductToCart(tempCartProduct)
        push('/cart');

    }

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
                            <ItemCounter
                                currentQuantity={tempCartProduct.quantity}
                                maxValue={tempCartProduct.inStock}
                                updatedQuantity={updatedQuantity}
                            />
                            <SizeSelector
                                selectedSize={tempCartProduct.size}
                                sizes={product.sizes}
                                onSelectedSize={onSelectedSize}
                            />
                        </Box>

                        {/* Agregar al carrito */}
                        {
                            product.inStock > 0
                                ? (
                                    <Button
                                        color='secondary' className='circular-btn' fullWidth
                                        onClick={onAddProduct}
                                    >
                                        {
                                            tempCartProduct.size
                                                ? 'Agregar al carrito'
                                                : 'Seleccionar una talla'
                                        }

                                    </Button>
                                )
                                : (<Chip label='No hay disponibles' color='error' variant='outlined' />)
                        }




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
