import React, { useEffect, useState }            from 'react'
import { PeopleOutlined }                        from '@mui/icons-material';
import { GridColDef, GridRenderCellParams }      from '@mui/x-data-grid'
import { Avatar, FormControl, MenuItem, Select } from '@mui/material';

import useSWR from 'swr';

import { AlertSnackbar, DataTable, FullScreenLoading } from '@/components/ui';
import { IUser }                        from '@/interfaces';
import { shopApi }                      from '@/api';
import { AdminLayout }                  from '@/components/layouts'
import { useWidthColumns } from '../../utils/useWidthColumns';

const UserPage = () => {

    const { data, error, isLoading } = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([])
    const [ column1, column2 ] = useWidthColumns();
    const [alertSnack, setAlertSnack] = useState({
        open: false,
        message: '',
        severity: 'success',
    });


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
        { field: 'name', headerName: 'Nombre Completo', width: column1, maxWidth:588, minWidth: 200 },
        { field: 'email', headerName: 'Correo', width: column2, maxWidth: 588, minWidth: 200 },
        {
            field: 'role',
            headerName: 'Rol',
            width: 200,
            filterable: false,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <FormControl variant='standard' sx={{ minWidth:'150px' }}>
                        <Select
                            disabled={ row.email === 'sergio@gmail.com' }
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
            setAlertSnack({
                open: true,
                message: 'Se actualizó el Rol del usuario',
                severity: 'success',
            })
        }catch(error: any){
            setUsers(previousUsers)
            console.log(error);
            setAlertSnack({
                open: true,
                message: error?.response?.data?.msg || 'No se pudo actualizar el rol de usuario',
                severity: 'error',
            })

        }
    }


  return (
    <AdminLayout
        title='Usuarios'
        subtitle='Mantenimiento de usuarios'
        icon={<PeopleOutlined color='primary'/>}
    >
        <AlertSnackbar 
              alertSnackbar={alertSnack}
              setAlertSnackbar={setAlertSnack }
        />
        <DataTable
            title=''
            columns={columns}
            rows={rows}
        />
    </AdminLayout>
  )
}

export default UserPage