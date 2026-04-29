import React, { useState, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native'
import { StatusBar }      from 'expo-status-bar'
import { useFocusEffect } from '@react-navigation/native'
import { useTheme }       from '../context/ThemeContext.js'
import { useAuth }        from '../context/AuthContext.js'
import api                from '../api/axios.js'
import ReservationCard    from '../components/ReservationCard.js'
import AlertBanner        from '../components/AlertBanner.js'

export default function MyReservationsScreen() {
  const { colors, isDark } = useTheme()
  const { user }           = useAuth()
  const [reservations, setReservations] = useState([])
  const [refreshing, setRefreshing]     = useState(false)
  const [alert, setAlert]               = useState(null)

  const fetchReservations = useCallback(async () => {
    try {
      const { data } = await api.get('/reservations/my')
      setReservations(data)
    } catch {
      setAlert({ message: 'Impossible de charger vos réservations', type: 'error' })
    }
  }, [])

  useFocusEffect(useCallback(() => { fetchReservations() }, [fetchReservations]))

  const onRefresh = async () => { setRefreshing(true); await fetchReservations(); setRefreshing(false) }

  const handleCancel = async (id) => {
    try {
      await api.patch(`/reservations/${id}/cancel`)
      setAlert({ message: 'Réservation annulée avec succès', type: 'success' })
      fetchReservations()
    } catch (err) {
      setAlert({ message: err.response?.data?.message ?? 'Erreur lors de l\'annulation', type: 'error' })
    }
  }

  const counts = {
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    pending:   reservations.filter(r => r.status === 'pending').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  }

  const s = makeStyles(colors)

  return React.createElement(View, { style: s.container },
    React.createElement(StatusBar, { style: isDark ? 'light' : 'dark' }),

    React.createElement(View, { style: s.header },
      React.createElement(View, null,
        React.createElement(Text, { style: s.greeting }, `Bonjour, ${user?.name?.split(' ')[0]} 👋`),
        React.createElement(Text, { style: s.title }, 'Mes réservations')
      )
    ),

    // Summary
    React.createElement(View, { style: s.summaryRow },
      ...[
        { label: 'Confirmées', val: counts.confirmed, color: colors.green },
        { label: 'En attente', val: counts.pending,   color: colors.yellow },
        { label: 'Annulées',   val: counts.cancelled, color: colors.red },
      ].map(item =>
        React.createElement(View, { key: item.label, style: [s.summaryBox, { backgroundColor: colors.surface, borderColor: colors.border }] },
          React.createElement(Text, { style: [s.summaryVal, { color: item.color }] }, item.val),
          React.createElement(Text, { style: [s.summaryLabel, { color: colors.textMuted }] }, item.label)
        )
      )
    ),

    alert && React.createElement(AlertBanner, {
      message: alert.message, type: alert.type, onDismiss: () => setAlert(null)
    }),

    React.createElement(FlatList, {
      data: reservations,
      keyExtractor: item => String(item.id),
      renderItem: ({ item }) => React.createElement(ReservationCard, { reservation: item, onCancel: handleCancel }),
      contentContainerStyle: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },
      showsVerticalScrollIndicator: false,
      refreshControl: React.createElement(RefreshControl, { refreshing, onRefresh, tintColor: colors.primary }),
      ListEmptyComponent: React.createElement(View, { style: s.empty },
        React.createElement(Text, { style: { fontSize: 48, marginBottom: 14 } }, '📋'),
        React.createElement(Text, { style: [s.emptyTitle, { color: colors.text }] }, 'Aucune réservation'),
        React.createElement(Text, { style: [s.emptySub, { color: colors.textMuted }] }, 'Vos réservations apparaîtront ici')
      )
    })
  )
}

const makeStyles = c => StyleSheet.create({
  container:    { flex: 1, backgroundColor: c.bg },
  header:       { paddingHorizontal: 16, paddingTop: 58, paddingBottom: 14 },
  greeting:     { fontSize: 13, color: c.textMuted, fontWeight: '600', marginBottom: 2 },
  title:        { fontSize: 22, fontWeight: '900', color: c.text },
  summaryRow:   { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 10 },
  summaryBox:   { flex: 1, borderRadius: 13, borderWidth: 1, padding: 12, alignItems: 'center' },
  summaryVal:   { fontSize: 22, fontWeight: '900' },
  summaryLabel: { fontSize: 10, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  empty:        { alignItems: 'center', paddingTop: 72 },
  emptyTitle:   { fontSize: 17, fontWeight: '800', marginBottom: 5 },
  emptySub:     { fontSize: 13 },
})