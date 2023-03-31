import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import { FC } from 'react'

interface Props {
    currentQuantity: number;
    maxValue: number;
    // Métodos
    updatedQuantity: (quantity: number) => void;
}

export const ItemCounter: FC<Props> = ({ currentQuantity, maxValue, updatedQuantity }) => {
    return (
        <Box display='flex' alignItems='center'>
            <IconButton
                onClick={() => { currentQuantity > 1 ? updatedQuantity(-1) : null }}
            >
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{ width: 40, textAlign: 'center' }}>{currentQuantity}</Typography>
            <IconButton
                onClick={() => { maxValue > currentQuantity ? updatedQuantity(1) : null }}
            >
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}
