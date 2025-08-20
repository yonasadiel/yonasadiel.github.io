'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeColors {
  bgPrimary: string
  bgSecondary: string
  bgTertiary: string
  textPrimary: string
  textSecondary: string
  textTertiary: string
  textQuaternary: string
  textMuted: string
  borderColor: string
  borderSecondary: string
  shadowLight: string
  shadowMedium: string
  shadowHeavy: string
  accentColor: string
}

interface ThemeContextType {
  theme: Theme
  colors: ThemeColors
  toggleTheme: () => void
}

const lightColors: ThemeColors = {
  bgPrimary: '#e6e4e1',
  bgSecondary: '#f8f9fa',
  bgTertiary: '#e9ecef',
  textPrimary: '#333',
  textSecondary: '#666',
  textTertiary: '#444',
  textQuaternary: '#555',
  textMuted: '#888',
  borderColor: '#e0e0e0',
  borderSecondary: '#e9ecef',
  shadowLight: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowHeavy: 'rgba(0, 0, 0, 0.2)',
  accentColor: '#007bff'
}

const darkColors: ThemeColors = {
  bgPrimary: '#290029',
  bgSecondary: '#3d1a3d',
  bgTertiary: '#4a2a4a',
  textPrimary: '#e6e4e1',
  textSecondary: '#c0bdb8',
  textTertiary: '#d0cdc8',
  textQuaternary: '#b8b5b0',
  textMuted: '#a0a0a0',
  borderColor: '#5a3a5a',
  borderSecondary: '#4a2a4a',
  shadowLight: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.4)',
  shadowHeavy: 'rgba(0, 0, 0, 0.5)',
  accentColor: '#6c5ce7'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('lateral-theme') as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('lateral-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const colors = theme === 'light' ? lightColors : darkColors

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}