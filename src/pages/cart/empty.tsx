
import NextLink from 'next/link';
import { Box, Link, Typography } from "@mui/material"
import { RemoveShoppingCartOutlined } from "@mui/icons-material"
import { ShopLayout } from "@/components/layouts"


const EmptyPage = () => {
    return (
        <ShopLayout title='Carrito Vacío' pageDescription="No hay articulos en el carrito de compras">
            <Box
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='calc(100vh - 200px)'
            >
                <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
                <Box display='flex' flexDirection='column' marginLeft={2} justifyContent='center' alignItems='center'>
                    <Typography variant='h2' component='h2'>Su carrito está vacío</Typography>
                    <NextLink href='/' passHref legacyBehavior>
                        <Link variant='h4' color='secondary'>
                            Regresar
                        </Link>
                    </NextLink>
                </Box>
            </Box>
        </ShopLayout>
    )
}

export default EmptyPage