import React, { createContext, useContext } from 'react'
import { useColorScheme } from 'react-native'
import { lightColors, darkColors } from '../theme/colors.js'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const scheme = useColorScheme()
  const isDark  = scheme === 'dark'
  const colors  = isDark ? darkColors : lightColors

  return React.createElement(
    ThemeContext.Provider,
    { value: { colors, isDark } },
    children
  )
}

export const useTheme = () => useContext(ThemeContext)