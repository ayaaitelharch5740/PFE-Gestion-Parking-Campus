import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext.js'

export default function SlotCard({ slot, onPress }) {
  const { colors } = useTheme()

  const statusCfg = {
    available:   { bg: colors.greenLight,   border: colors.green,   text: colors.green,   label: 'Disponible',  dot: colors.green },
    occupied:    { bg: colors.primaryLight, border: colors.primary, text: colors.primary, label: 'Occupée',     dot: colors.primary },
    maintenance: { bg: colors.orangeLight,  border: colors.orange,  text: colors.orange,  label: 'Maintenance', dot: colors.orange },
  }
  const cfg         = statusCfg[slot.status] ?? statusCfg.available
  const isAvailable = slot.status === 'available'

  return React.createElement(TouchableOpacity, {
    onPress:       isAvailable ? onPress : undefined,
    activeOpacity: isAvailable ? 0.72 : 1,
    style: [
      styles.card,
      {
        backgroundColor: colors.surface,
        borderColor:     isAvailable ? colors.border : cfg.border + '55',
        opacity:         slot.status === 'maintenance' ? 0.6 : 1,
        shadowColor:     colors.cardShadow,
      }
    ]
  },
    // Top row
    React.createElement(View, { style: styles.topRow },
      React.createElement(View, { style: [styles.zonePill, { backgroundColor: colors.primary }] },
        React.createElement(Text, { style: styles.zoneText }, slot.zone)
      ),
      React.createElement(Text, { style: [styles.slotCode, { color: colors.text }] }, slot.slot_code),
      React.createElement(View, { style: { flex: 1 } }),
      React.createElement(View, { style: [styles.statusPill, { backgroundColor: cfg.bg }] },
        React.createElement(View, { style: [styles.statusDot, { backgroundColor: cfg.dot }] }),
        React.createElement(Text, { style: [styles.statusText, { color: cfg.text }] }, cfg.label)
      )
    ),

    // Type + action
    React.createElement(View, { style: styles.bottomRow },
      React.createElement(Text, { style: [styles.typeText, { color: colors.textMuted }] },
        { student: '🎓 Étudiant', staff: '👔 Personnel', visitor: '🙋 Visiteur' }[slot.type] ?? slot.type
      ),
      isAvailable && React.createElement(View, {
        style: [styles.reserveTag, { backgroundColor: colors.primary }]
      },
        React.createElement(Text, { style: styles.reserveTagText }, 'Réserver →')
      )
    )
  )
}

const styles = StyleSheet.create({
  card:       { borderRadius: 16, borderWidth: 1.5, padding: 16, marginBottom: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  topRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  zonePill:   { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  zoneText:   { color: '#fff', fontSize: 13, fontWeight: '900' },
  slotCode:   { fontSize: 17, fontWeight: '800' },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusDot:  { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700' },
  bottomRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  typeText:   { fontSize: 12 },
  reserveTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  reserveTagText: { color: '#fff', fontSize: 12, fontWeight: '700' },
})