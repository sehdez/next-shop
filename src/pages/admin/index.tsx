import { SummaryTitle } from '@/components/admin';
import { AdminLayout } from '@/components/layouts'
import { FullScreenLoading } from '@/components/ui';
import { DashboardSummaryResponse } from '@/interfaces';
import { DashboardOutlined, CreditCardOffOutlined, AttachMoneyOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material'
import React from 'react'
import useSWR from 'swr';
import { useState, useEffect } from 'react';

const DashboardPage = () => {

    const [refreshIn, setRefreshIn] = useState(30)
    useEffect(() => {
        
        const interval = setInterval( ()=> {
            setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn -1 : 30 )
        }, 1000)

        return () => clearInterval(interval)

    }, [])
    // Aquí se hace la llamada al enpoint para obtener la info
    const { data, error, isLoading } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000 // 30 segundos
    })



    if (isLoading){
        return <FullScreenLoading/>
    } 

    if(error){
        console.log(error)
        return <Typography>Error al cargar la información</Typography>
    }
    const { numberOfOrders,
            paidOrders,
            notPaidOrders,
            numberOfClients,
            numberOfProducts,
            productsWithNoInventory,
            lowInventory 
        } = data!;

        // Arreglo para las card del dashboard
    const cardsArr = [
        { title: numberOfOrders,          subtitle: 'Órdenes totales',    icon: <CreditCardOffOutlined            color='secondary' sx={{ fontSize: 40 }} /> },
        { title: paidOrders,              subtitle: 'Órdenes pagadas',    icon: <AttachMoneyOutlined              color='secondary' sx={{ fontSize: 40 }} /> },
        { title: notPaidOrders,           subtitle: 'Órdenes pendientes', icon: <CreditCardOffOutlined            color='error'     sx={{ fontSize: 40 }} /> },
        { title: numberOfClients,         subtitle: 'Clientes',           icon: <GroupOutlined                    color='primary'   sx={{ fontSize: 40 }} /> },
        { title: numberOfProducts,        subtitle: 'Productos',          icon: <CategoryOutlined                 color='warning'   sx={{ fontSize: 40 }} /> },
        { title: productsWithNoInventory, subtitle: 'Sin existencias',    icon: <CancelPresentationOutlined       color='error'     sx={{ fontSize: 40 }} /> },
        { title: lowInventory,            subtitle: 'Bajo inventario',    icon: <ProductionQuantityLimitsOutlined color='warning'   sx={{ fontSize: 40 }} /> },
    ]

    return (
        <AdminLayout
            title='Dashboard'
            subtitle='Estadisticas generales'
            icon={ <DashboardOutlined/> }
        >
            <Grid container spacing={2} >
            
                {
                    cardsArr.map(({ title, subtitle, icon }) => (
                        <SummaryTitle
                            key={title + subtitle}
                            title={title}
                            subtitle={ subtitle }
                            icon= { icon }
                        />

                    ))
                }
                <SummaryTitle
                    title={refreshIn}
                    subtitle='Actualización en: '
                    icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
                />
            </Grid>

        </AdminLayout>
    )
}

export default DashboardPage