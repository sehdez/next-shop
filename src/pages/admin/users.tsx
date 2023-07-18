import React, { useEffect, useState } from 'react'
import { AdminLayout } from '@/components/layouts'
import {  PeopleOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Avatar, CardMedia, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import useSWR from 'swr';
import { FullScreenLoading } from '@/components/ui';
import { IUser } from '@/interfaces';
import { shopApi } from '@/api';

const users = () => {

    const { data, error, isLoading } = useSWR<IUser[]>('/api/admin/users');
    const [columnWidths, setColumnWidths] = React.useState<any>([]);
    const [users, setUsers] = useState<IUser[]>([])
    


// UseEffect para calcular el tamaño de las columnas
    useEffect(() => {

        const calculateColumnWidths = () => {
            /**
             * EL CONTENEDOR DE LA TABLA MIDE UN MÁXIMO DE 1440PX, Y HAY DOS COLUMNAS ESTÁTICAS DE 100PX MAS 60 PX DE PADDING
             * EN ESTE CASO SÓLO SE HIZO EL CALCULO PARA 2 COLUMNAS QUE VAN A TENER EL 48% DEL CONTENEDOR - LAS 2 CULUMNAS
             */
            const screenWidth = window.innerWidth > 1500 ? 1140 :  window.innerWidth -360 ;
            const columnWidths = [
                screenWidth * 0.47,
                screenWidth * 0.47,
            ];
            setColumnWidths(columnWidths);
        };

        calculateColumnWidths();

        // Agrega un event listener para recalcular los anchos cuando cambie el tamaño de la ventana
        window.addEventListener('resize', calculateColumnWidths);

        // Limpia el event listener cuando el componente se desmonte
        return () => {
            window.removeEventListener('resize', calculateColumnWidths);
        };
    }, []);

    useEffect(()=> {
        if(data){
            setUsers(data)
        }
    },[data])


    if (isLoading) {
        return <FullScreenLoading />
    }

    const columns: GridColDef[] = [
        {
            field: 'image',
            headerName: 'Imagen',
            width: 100,
            sortable: false,
            filterable: false,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <Avatar
                        src={ row.image }
                        sx={{ width: 30, height:30, borderRadius: '50%' }}
                        alt={row.name}
                        className='fadeIn '
                    />
                )
            }
        },
        { field: 'name', headerName: 'Nombre Completo', width: columnWidths[0], maxWidth:588, minWidth: 200 },
        { field: 'email', headerName: 'Correo', width: columnWidths[1], maxWidth: 588, minWidth: 200 },
        {
            field: 'role',
            headerName: 'Rol',
            width: 200,
            filterable: false,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <FormControl variant='standard' sx={{ minWidth:'150px' }}>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={ row.role }
                            label='Rol'
                            sx={{ width:'100%', border: 'none' }}
                            className='fadeIn pointer-events'
                            onChange={ (e) => onRoleUpdated( row.id, e.target.value) }
                            >
                            <MenuItem className='custom-data-grid' value='admin' >Administrador</MenuItem>
                            <MenuItem className='custom-data-grid' value='client' >Cliente</MenuItem>
                        </Select>
                    </FormControl>
                )
            }
        }
    ]

    const rows = users!.map( user => ({
        id    : user._id,
        image : '/icon.png',
        email : user.email,
        name  : user.name,
        role  : user.role
    }))

    const onRoleUpdated = async (userId: string, newRole: 'admin' | 'client' ) => {
        const previousUsers = users.map( user => ({...user}));
        const updatedUsers = users.map( user => ({
            ...user,
            role: userId=== user._id ? newRole : user.role
        }))
        setUsers(updatedUsers)
        try{
            await shopApi.put('/admin/users', { userId, role: newRole });
        }catch(error){
            setUsers(previousUsers)
            console.log(error);
            alert('No se pudo actualizar el rol de usuario')

        }
    }


  return (
    <AdminLayout
        title='Usuarios'
        subtitle='Mantenimiento de usuarios'
        icon={<PeopleOutlined color='primary'/>}
    >
          <Grid container className='fadeIn'>
              <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[25, 50, 100]}
                  />
              </Grid>
          </Grid>
    </AdminLayout>
  )
}

export default users