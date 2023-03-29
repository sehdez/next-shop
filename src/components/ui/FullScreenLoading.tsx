import { ShopLayout } from '@/components/layouts'
import { Box, CircularProgress, Typography } from '@mui/material'

export const FullScreenLoading = () => {
    return (
        <ShopLayout title='Página no encontrada' pageDescription='No hay nada que mostrar aquí'>
            <Box
                sx={{ flexDirection: 'column' }}
                display='flex'
                justifyContent='center'
                alignItems='center'
                height='calc(100vh - 200px)'
            >
                <Typography variant='h2' fontWeight={200} sx={{ mb: 3 }}>Cargando...</Typography>
                <CircularProgress />
            </Box>
        </ShopLayout>
    )
}

