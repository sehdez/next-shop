import { FC, useContext } from 'react';
import { Grid, Typography } from '@mui/material'
import { CartContext } from '@/context';
import { currency } from '@/utils';
import { IOrder } from '../../interfaces/order';

interface Props{
    orderFromBackend?: IOrder
}


export const OrderSummary: FC<Props> = ({orderFromBackend}) => {
    /**
     * Este componente se utiliza para mostrar info del carrito de compras 
     * y también para mostrar la info de una orden realizada
     * así que cuando se mande la props orderFromBackend va a utilizar la info 
     * de la orden de compra, de lo contrario va autilizar la info del carrito de compras
     */
    const { numberOfItems, subtotal, taxRate, total } = orderFromBackend ? orderFromBackend : useContext(CartContext)
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
