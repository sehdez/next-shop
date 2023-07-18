import Head from 'next/head'
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { FullScreenLoading, Navbar, SideMenu } from '../ui';
import { useRouter } from 'next/router';
import { AdminNavbar } from '../admin/AdminNavbar';
import { Box, Typography } from '@mui/material';

interface Props {
    title: string;
    subtitle: string;
    icon?: JSX.Element
}

export const AdminLayout: FC<PropsWithChildren & Props> = ({ children, subtitle, icon, title }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const startLoading = () => setLoading(true);
        const endLoading = () => setLoading(false);

        router.events.on('routeChangeStart', startLoading);
        router.events.on('routeChangeComplete', endLoading);
        router.events.on('routeChangeError', endLoading);

        return () => {
            router.events.off('routeChangeStart', startLoading);
            router.events.off('routeChangeComplete', endLoading);
            router.events.off('routeChangeError', endLoading);
        };
    }, []);
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta name='og:title' content={title} />
                <link rel="icon" href="/icon.png" />
            </Head>
            {loading && <FullScreenLoading />}

            <nav>
                <AdminNavbar />
            </nav>

            <SideMenu />

            <main
                style={{
                    margin: '80px auto',
                    maxWidth: '1440px',
                    padding: '0px 30px'
                }}
            >
                <Box display='flex' flexDirection='column'>
                    <Typography variant='h1' component='h1'>
                        { icon }
                        { ' ' }
                        { title }
                    </Typography>
                    <Typography variant='h2' sx={{ mb:1 }}>{ subtitle }</Typography>
                </Box>
                <Box className ='fadeIn'>
                    {children}
                </Box>
            </main>

            <footer>
                {/* TODO Custom Footrer */}
            </footer>
        </>
    )
}
