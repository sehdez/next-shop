import '@/styles/globals.css'
import { lightTheme } from '@/themes'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/system'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  )

}
