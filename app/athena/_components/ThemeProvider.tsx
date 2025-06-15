'use client'

import { CssVarsProvider, extendTheme } from '@mui/joy/styles'

export const theme = extendTheme({
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
})

export default function AthenaThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <CssVarsProvider theme={theme}>
      {children}
    </CssVarsProvider>
  )
}
