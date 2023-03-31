import { FC, useContext } from 'react'
import NextLink from 'next/link'
import { CartContext } from '@/context';
import { initialData } from '../../database/products';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import { ItemCounter } from '../ui/ItemCounter';
import { ICartProduct } from '@/interfaces';

interface Props {
    editable?: boolean;
}

export const CartList: FC<Props> = ({ editable = false }) => {
    const { updateCartQuantity, removeProductInCart, cart } = useContext(CartContext)

    const changeItemQuantity = (product: ICartProduct, newQuantityValue: number) => {
        product.quantity += newQuantityValue;
        updateCartQuantity(product)
    }
    return (
        <>
            {
                cart.map((product, index) => (
                    <Grid container spacing={2} key={`${product.slug}-${index}`} sx={{ mb: 1 }}>
                        <Grid item xs={3}>
                            {/* TODO: llevar a la página del producto */}
                            <NextLink href={`/product/${product.slug}`} passHref legacyBehavior>
                                <Link>
                                    <CardActionArea>
                                        <CardMedia
                                            image={`/products/${product.image}`}
                                            alt={product.title}
                                            component='img'
                                            sx={{ borderRadius: '5px' }}
                                        />
                                    </CardActionArea>
                                </Link>
                            </NextLink>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1'>{product.title}</Typography>
                                <Typography variant='body1'>Talla: <strong>{product.size}</strong></Typography>

                                {/* Condicional */}
                                {
                                    editable
                                        ? (<ItemCounter
                                            currentQuantity={product.quantity}
                                            maxValue={product.inStock}
                                            updatedQuantity={(value) => changeItemQuantity(product, value)}
                                        />)
                                        : <Typography variant='body1'>{product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}</Typography>
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1' >${product.price * product.quantity}</Typography>
                            {/* Editable */}
                            {
                                editable &&
                                (
                                    <Button
                                        onClick={() => removeProductInCart(product)}
                                        variant='text' color='error' >
                                        Remover
                                    </Button>
                                )

                            }

                        </Grid>

                    </Grid>
                ))
            }
        </>
    )
}
