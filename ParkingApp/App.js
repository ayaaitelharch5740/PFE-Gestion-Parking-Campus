import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider } from './src/context/AuthContext.js'
import { ThemeProvider } from './src/context/ThemeContext.js'
import AppNavigator from './src/navigation/AppNavigator.js'
import SplashScreen from './src/screens/SplashScreen.js'

export default function App() {
  const [splashDone, setSplashDone] = useState(false)

  if (!splashDone) {
    return React.createElement(SplashScreen, { onFinish: () => setSplashDone(true) })
  }

  return React.createElement(SafeAreaProvider, null,
    React.createElement(ThemeProvider, null,
      React.createElement(AuthProvider, null,
        React.createElement(AppNavigator)
      )
    )
  )
}