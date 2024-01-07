'use client'

import { Roboto } from 'next/font/google'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import './global.css'
import './global.scss'

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})


const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
    },
  },
});

const Olympus = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className={`${roboto.className}`}>
      <head>
        <link rel="icon" type="image/x-icon" href="/assets/favicon-32.ico" />
      </head>
      <body>
        <CssVarsProvider theme={theme}>
          {children}
        </CssVarsProvider>
      </body>
    </html>
  )
}

export default Olympus
