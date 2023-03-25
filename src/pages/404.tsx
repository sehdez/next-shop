import { ShopLayout } from '@/components/layouts'
import { Box, Typography } from '@mui/material'

const Custom404 = () => {
    return (
        <ShopLayout title='Página no encontrada' pageDescription='No hay nada que mostrar aquí'>
            <Box
                sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='calc(100vh - 200px)'
            >
                <Typography variant='h1' component='h1' fontSize={80} fontWeight={200}>404 |</Typography>
                <Box flexDirection='column' marginLeft={2}>
                    <Typography variant='h2' component='h2'>¡Vaya! Lo sentimos</Typography>
                    <Typography >No encontramos ninguna página aquí</Typography>
                </Box>
            </Box>
        </ShopLayout>
    )
}

export default Custom404