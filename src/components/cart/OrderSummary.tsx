import { FC, useContext } from 'react';
import { Grid, Typography } from '@mui/material'
import { CartContext } from '@/context';
import { currency } from '@/utils';


export const OrderSummary: FC = () => {
    const { numberOfItems, subtotal, taxRate, total } = useContext(CartContext)
    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{numberOfItems} </Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Subtotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(subtotal)}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mb: 2 }}>
                <Typography>Impuestos ({process.env.NEXT_PUBLIC_TAX_RATE}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography >{currency.format(taxRate)}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography variant='subtitle1'>Total:</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>{currency.format(total)}</Typography>
            </Grid>
        </Grid>
    )
}
