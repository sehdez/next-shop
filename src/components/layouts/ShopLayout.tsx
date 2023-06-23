import Head from 'next/head'
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { FullScreenLoading, Navbar, SideMenu } from '../ui';
import { useRouter } from 'next/router';

interface Props {
    title: string;
    pageDescription: string;
    imageFullUrl?: string;
}

export const ShopLayout: FC<PropsWithChildren & Props> = ({ children, imageFullUrl, pageDescription, title }) => {
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
                <meta name='description' content={pageDescription} />
                <meta name='og:title' content={title} />
                <meta name='og:description' content={pageDescription} />
                {
                    imageFullUrl && (
                        <meta name='og:image' content={imageFullUrl} />
                    )
                }
                <link rel="icon" href="/icon.png" /> 
            </Head>
            {loading && <FullScreenLoading />}

            <nav>
                <Navbar />
            </nav>

            <SideMenu />

            <main
                style={{
                    margin: '80px auto',
                    maxWidth: '1440px',
                    padding: '0px 30px'
                }}
            >
                {children}
            </main>

            <footer>
                {/* TODO Custom Footrer */}
            </footer>
        </>
    )
}
