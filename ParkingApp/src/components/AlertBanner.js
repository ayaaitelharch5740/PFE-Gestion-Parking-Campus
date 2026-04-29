import React, { useEffect, useRef } from 'react'
import { Animated, Text, TouchableOpacity, StyleSheet, View } from 'react-native'
import { useTheme } from '../context/ThemeContext.js'

export default function AlertBanner({ message, type = 'success', onDismiss }) {
  const { colors } = useTheme()
  const opacity    = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(-16)).current

  const cfg = {
    success: { bg: colors.greenLight,  border: colors.green,  text: colors.green,  icon: '✓' },
    error:   { bg: colors.redLight,    border: colors.red,    text: colors.red,    icon: '✕' },
    warning: { bg: colors.yellowLight, border: colors.yellow, text: colors.yellow, icon: '⚠' },
    info:    { bg: colors.primaryLight,border: colors.primary,text: colors.primary,icon: 'ℹ' },
  }[type] ?? {}

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 280, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
    ]).start()

    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity,    { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -16, duration: 220, useNativeDriver: true }),
      ]).start(() => onDismiss?.())
    }, 3500)

    return () => clearTimeout(t)
  }, [])

  return React.createElement(Animated.View, {
    style: [
      styles.wrap,
      { backgroundColor: cfg.bg, borderLeftColor: cfg.border, opacity, transform: [{ translateY }] }
    ]
  },
    React.createElement(View, { style: [styles.iconBox, { backgroundColor: cfg.border + '22' }] },
      React.createElement(Text, { style: { color: cfg.text, fontSize: 13, fontWeight: '800' } }, cfg.icon)
    ),
    React.createElement(Text, { style: [styles.msg, { color: cfg.text }] }, message),
    React.createElement(TouchableOpacity, { onPress: onDismiss, hitSlop: { top: 8, bottom: 8, left: 8, right: 8 } },
      React.createElement(Text, { style: { color: cfg.text, fontSize: 18, opacity: 0.6, marginLeft: 8 } }, '×')
    )
  )
}

const styles = StyleSheet.create({
  wrap:   { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginVertical: 6, padding: 14, borderRadius: 14, borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3 },
  iconBox:{ width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  msg:    { flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 18 },
})