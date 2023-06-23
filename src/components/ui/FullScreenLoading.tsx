import { ShopLayout } from '@/components/layouts'
import { Box, CircularProgress, Typography, CardMedia } from '@mui/material';

export const FullScreenLoading = () => {
    return (
        <Box
            sx={{ 
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left:0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.7)', /* Fondo semitransparente */
                zIndex:1101
            }}
            className='fadein'
            display='flex'
            justifyContent='center'
            alignItems='center'
            // height='calc(100vh - 200px)'
        >
            <div className='rotatingImage fadein'></div>
        </Box>
    )
}

