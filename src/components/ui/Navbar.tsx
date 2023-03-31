import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react';
import { UiContext } from '@/context';
import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material'
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import { CartContext } from '../../context/cart/CartContext';

export const Navbar = () => {
    const { pathname } = useRouter();
    const { toggleSideMenu } = useContext(UiContext)
    const { cart } = useContext(CartContext)

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false)


    const router = useRouter()

    const onSearchTerm = () => {

        if (searchTerm.trim().length === 0) return;
        router.push(`/search/${searchTerm}`)
    }



    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref legacyBehavior>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>


                <Box sx={{ flex: 1 }} />

                <Box
                    className='fadeIn'
                    sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}>
                    <NextLink href='/category/men' passHref legacyBehavior>
                        <Link>
                            <Button color={pathname === '/category/men' ? 'primary' : 'info'}>Hombres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/women' passHref legacyBehavior>
                        <Link>
                            <Button color={pathname === '/category/women' ? 'primary' : 'info'}>Mujeres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/kid' passHref legacyBehavior>
                        <Link>
                            <Button color={pathname === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
                        </Link>
                    </NextLink>
                </Box>

                <Box sx={{ flex: 1 }} />
                {/* pantallas grandes */}
                {
                    isSearchVisible
                        ? (
                            <Input
                                sx={{ display: { xs: 'none', sm: 'flex' } }}
                                className='fadeIn'
                                autoFocus
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                onKeyUp={e => e.code === 'Enter' ? onSearchTerm() : null}
                                type='text'
                                placeholder='Buscar...'
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={() => setIsSearchVisible(false)}
                                        >
                                            <ClearOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        )
                        : (
                            <IconButton
                                sx={{ display: { xs: 'none', sm: 'block' } }}
                                className='fadeIn'
                                onClick={() => setIsSearchVisible(true)}
                            >
                                <SearchOutlined />
                            </IconButton>
                        )
                }

                {/* Pantallas pequeñas */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href={cart.length > 0 ? '/cart' : '/cart/empty'} passHref legacyBehavior>
                    <Link>
                        <IconButton>
                            <Badge badgeContent={cart.length < 9 ? cart.length : '+9'} color='secondary'>
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button onClick={toggleSideMenu} >Menú</Button>
            </Toolbar>
        </AppBar>
    )
}
