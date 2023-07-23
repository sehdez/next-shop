import React, { FC } from 'react'
import orders from '@/pages/api/orders'
import { Typography, Grid } from '@mui/material'
import { DataGrid, esES, GridColDef } from '@mui/x-data-grid'


interface Props{
    title      : string;
    rows       : any [];
    columns    : GridColDef[];
    rowHeight? : number;
}
export const DataTable: FC<Props> = ( { title, rows, columns, rowHeight=52 } ) => {
    return (
        <>
            <Typography variant='h1' component='h1'>{ title }</Typography>

            <Grid container className='fadeIn'>
                <Grid item sx={{ height: 'calc(100vh - 290px)', minHeight: 600, width: '100%' }}>
                    <DataGrid
                        rowHeight={ rowHeight }
                        rows={ rows }
                        columns={columns}
                        pageSizeOptions={[25, 50, 100]}
                        localeText={esES.components.MuiDataGrid.defaultProps.localeText }
                        hideFooterSelectedRowCount
                    />
                </Grid>
            </Grid>
        </>
    )
}
