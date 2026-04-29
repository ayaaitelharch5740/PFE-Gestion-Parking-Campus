import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext.js'

export default function ReservationCard({ reservation: r, onCancel }) {
  const { colors } = useTheme()

  const statusCfg = {
    confirmed: { bg: colors.greenLight,   text: colors.green,   label: 'Confirmée'  },
    pending:   { bg: colors.yellowLight,  text: colors.yellow,  label: 'En attente' },
    cancelled: { bg: colors.redLight,     text: colors.red,     label: 'Annulée'    },
    completed: { bg: colors.surfaceAlt,   text: colors.textMuted,label: 'Terminée'  },
  }
  const cfg       = statusCfg[r.status] ?? statusCfg.pending
  const canCancel = r.status === 'confirmed' || r.status === 'pending'

  const fmt = dt => new Date(dt).toLocaleString('fr-MA', { dateStyle: 'short', timeStyle: 'short' })

  return React.createElement(View, {
    style: [styles.card, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: colors.cardShadow }]
  },
    // Header
    React.createElement(View, { style: styles.header },
      React.createElement(View, { style: [styles.zoneBadge, { backgroundColor: colors.primary }] },
        React.createElement(Text, { style: styles.zoneText }, r.zone)
      ),
      React.createElement(View, { style: { flex: 1 } },
        React.createElement(Text, { style: [styles.slotCode, { color: colors.text }] }, r.slot_code),
        React.createElement(Text, { style: [styles.plate, { color: colors.primary }] }, r.plate_number)
      ),
      React.createElement(View, { style: [styles.badge, { backgroundColor: cfg.bg }] },
        React.createElement(Text, { style: [styles.badgeText, { color: cfg.text }] }, cfg.label)
      )
    ),

    React.createElement(View, { style: [styles.divider, { backgroundColor: colors.border }] }),

    // Times
    React.createElement(View, { style: styles.timesRow },
      React.createElement(View, { style: styles.timeBlock },
        React.createElement(Text, { style: [styles.timeLabel, { color: colors.textMuted }] }, 'DÉBUT'),
        React.createElement(Text, { style: [styles.timeVal, { color: colors.text }] }, fmt(r.start_time))
      ),
      React.createElement(Text, { style: [styles.arrow, { color: colors.textMuted }] }, '→'),
      React.createElement(View, { style: [styles.timeBlock, { alignItems: 'flex-end' }] },
        React.createElement(Text, { style: [styles.timeLabel, { color: colors.textMuted }] }, 'FIN'),
        React.createElement(Text, { style: [styles.timeVal, { color: colors.text }] }, fmt(r.end_time))
      )
    ),

    canCancel && React.createElement(TouchableOpacity, {
      onPress: () => onCancel(r.id),
      style: [styles.cancelBtn, { borderColor: colors.red + '60' }]
    },
      React.createElement(Text, { style: [styles.cancelText, { color: colors.red }] }, '✕  Annuler la réservation')
    )
  )
}

const styles = StyleSheet.create({
  card:      { borderRadius: 16, borderWidth: 1.5, padding: 16, marginBottom: 12, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  header:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  zoneBadge: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  zoneText:  { color: '#fff', fontSize: 14, fontWeight: '900' },
  slotCode:  { fontSize: 16, fontWeight: '800' },
  plate:     { fontSize: 13, fontWeight: '700', marginTop: 1 },
  badge:     { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  divider:   { height: 1, marginBottom: 12 },
  timesRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeBlock: { flex: 1 },
  timeLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 3 },
  timeVal:   { fontSize: 13, fontWeight: '600' },
  arrow:     { fontSize: 18, marginHorizontal: 8 },
  cancelBtn: { marginTop: 14, borderWidth: 1.5, borderRadius: 10, padding: 11, alignItems: 'center' },
  cancelText:{ fontSize: 13, fontWeight: '700' },
})