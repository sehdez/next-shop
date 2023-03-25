import NextLink from 'next/link'
import { FC } from 'react'
import { initialData } from '../../../database/products';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import { ItemCounter } from '../ui/ItemCounter';

interface Props {
    editable?: boolean;
}
const productInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2]
]
export const CartList: FC<Props> = ({ editable = false }) => {
    return (
        <>
            {
                productInCart.map(product => (
                    <Grid container spacing={2} key={product.slug} sx={{ mb: 1 }}>
                        <Grid item xs={3}>
                            {/* TODO: llevar a la página del producto */}
                            <NextLink href='/product/slug' passHref legacyBehavior>
                                <Link>
                                    <CardActionArea>
                                        <CardMedia
                                            image={`/products/${product.images[0]}`}
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
                                <Typography variant='body1'>Talla: <strong>M</strong></Typography>

                                {/* Condicional */}
                                {
                                    editable
                                        ? <ItemCounter />
                                        : <Typography variant='body1'>3 tems</Typography>
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                            <Typography variant='subtitle1' >${product.price}</Typography>
                            {/* Editable */}
                            {
                                editable &&
                                (
                                    <Button variant='text' color='error' >
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
