import { Divider, Grid, Typography } from "@mui/material"

export const OrderSummary = () => {
    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>3 items</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography>Subtotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>${'150.00'}</Typography>
            </Grid>

            <Grid item xs={6} sx={{ mb: 2 }}>
                <Typography>Impuestos (15%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>${'15.00'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography variant='subtitle1'>Total:</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>${'165.00'}</Typography>
            </Grid>
        </Grid>
    )
}
