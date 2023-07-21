import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { AuthContext, UiContext } from '@/context'

import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';


export const SideMenu = () => {
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext)
    const [searchTerm, setSearchTerm] = useState('');

    const { isLoggedIn, user, logout } = useContext(AuthContext)

    const router = useRouter()

    const onSearchTerm = () => {

        if (searchTerm.trim().length === 0) return;

        navigateTo(`/search/${searchTerm}`)
    }

    const navigateTo = (url: string) => {
        router.push(url)
        toggleSideMenu();
    }



    return (
        <Drawer
            open={isMenuOpen}
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onClose={toggleSideMenu}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>
                <List>
                    <ListItem>
                        <Input
                            autoFocus
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyUp={e => e.code === 'Enter' ? onSearchTerm() : null}
                            type='text'
                            placeholder='Buscar...'
                            endAdornment={
                                <InputAdornment position='end'>
                                    <IconButton
                                        onClick={onSearchTerm}
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    <ListItem button
                        onClick={() => navigateTo('/')}
                        sx={{ display: isLoggedIn ? 'flex' : 'none' }}
                    >
                        <ListItemIcon>
                            <AccountCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Perfil'} />
                    </ListItem>

                    <ListItem button
                        sx={{ display: isLoggedIn ? 'flex' : 'none' }}
                        onClick={() => navigateTo('/orders/history')}
                    >
                        <ListItemIcon>
                            <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mis Ordenes'} />
                    </ListItem>


                    <ListItem button
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/men')}
                    >
                        <ListItemIcon>
                            <MaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItem>

                    <ListItem button
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/women')}
                    >
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItem>

                    <ListItem button
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={() => navigateTo('/category/kid')}
                    >
                        <ListItemIcon>
                            <EscalatorWarningOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItem>


                    <ListItem button
                        onClick={() => navigateTo(`/auth/login?p=${ router.asPath }`)}
                        sx={{ display: isLoggedIn ? 'none' : 'flex' }}
                    >
                        <ListItemIcon>
                            <VpnKeyOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Ingresar'} />
                    </ListItem>

                    <ListItem button
                        onClick={logout}
                        sx={{ display: isLoggedIn ? 'flex' : 'none' }}
                    >
                        <ListItemIcon>
                            <LoginOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Salir'} />
                    </ListItem>


                    {/* Admin */}
                    <Box sx={{ display: user?.role === 'admin' ? 'block' : 'none' }} >
                        <Divider />
                        <ListSubheader>Admin Panel</ListSubheader>

                        <ListItem button
                            onClick={() => navigateTo('/admin')}
                        >
                            <ListItemIcon>
                                <DashboardOutlined />
                            </ListItemIcon>
                            <ListItemText primary={'Dashboard'} />
                        </ListItem>

                        <ListItem button
                            onClick={() => navigateTo('/admin/products')}
                        >
                            <ListItemIcon>
                                <CategoryOutlined />
                            </ListItemIcon>
                            <ListItemText primary={'Productos'} />
                        </ListItem>
                        <ListItem button
                            onClick={() => navigateTo('/admin/orders')}
                        >
                            <ListItemIcon>
                                <ConfirmationNumberOutlined />
                            </ListItemIcon>
                            <ListItemText primary={'Ordenes'} />
                        </ListItem>


                        <ListItem button
                            onClick={() => navigateTo('/admin/users')}
                        >
                            <ListItemIcon>
                                <AdminPanelSettings />
                            </ListItemIcon>
                            <ListItemText primary={'Usuarios'} />
                        </ListItem>
                    </Box>
                </List>
            </Box>
        </Drawer>
    )
}