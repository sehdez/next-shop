import type { AppProps } from 'next/app'
import { lightTheme } from '@/themes'
import { AuthProvider, CartProvider, UiProvider } from '@/context'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { SWRConfig } from 'swr'
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SWRConfig
          value={{
            // refreshInterval: 3000,
            fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
          }}
        >
            <AuthProvider>
                <CartProvider>
                    <UiProvider>
                        <ThemeProvider theme={lightTheme}>
                            <CssBaseline />
                            <Component {...pageProps} />
                        </ThemeProvider>
                    </UiProvider>
                </CartProvider>
            </AuthProvider>
        </SWRConfig>
    )

}
