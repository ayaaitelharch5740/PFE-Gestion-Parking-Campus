import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext.js'

const ICONS  = { car: '🚗', moto: '🏍', truck: '🚛' }
const LABELS = { car: 'Voiture', moto: 'Moto', truck: 'Camion' }

export default function VehicleCard({ vehicle: v, onDelete }) {
  const { colors } = useTheme()
  return React.createElement(View, {
    style: [styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.cardShadow }]
  },
    React.createElement(View, { style: [styles.iconBox, { backgroundColor: colors.primaryLight }] },
      React.createElement(Text, { style: { fontSize: 24 } }, ICONS[v.type] ?? '🚗')
    ),
    React.createElement(View, { style: { flex: 1 } },
      React.createElement(Text, { style: [styles.plate, { color: colors.text }] }, v.plate_number),
      React.createElement(Text, { style: [styles.sub, { color: colors.textMuted }] },
        `${LABELS[v.type] ?? v.type}${v.brand ? ' · ' + v.brand : ''}`
      )
    ),
    React.createElement(TouchableOpacity, {
      onPress: () => onDelete(v.id),
      style: [styles.delBtn, { backgroundColor: colors.redLight }],
      hitSlop: { top: 8, bottom: 8, left: 8, right: 8 }
    },
      React.createElement(Text, { style: [styles.delIcon, { color: colors.red }] }, '✕')
    )
  )
}

const styles = StyleSheet.create({
  card:    { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, borderWidth: 1.5, padding: 14, marginBottom: 10, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 },
  iconBox: { width: 48, height: 48, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  plate:   { fontSize: 15, fontWeight: '800' },
  sub:     { fontSize: 12, marginTop: 2 },
  delBtn:  { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  delIcon: { fontSize: 13, fontWeight: '800' },
})