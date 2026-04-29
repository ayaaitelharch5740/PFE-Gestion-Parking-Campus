import React, { useState, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  TextInput, StyleSheet, RefreshControl
} from 'react-native'
import { StatusBar }      from 'expo-status-bar'
import { useFocusEffect } from '@react-navigation/native'
import { useTheme }       from '../context/ThemeContext.js'
import api                from '../api/axios.js'
import SlotCard           from '../components/SlotCard.js'
import AlertBanner        from '../components/AlertBanner.js'

const ZONES = [
  { val: '',  label: 'Tout' },
  { val: 'A', label: 'Zone A' },
  { val: 'B', label: 'Zone B' },
  { val: 'C', label: 'Zone C' },
]

export default function SlotsScreen({ navigation }) {
  const { colors, isDark } = useTheme()
  const [slots, setSlots]           = useState([])
  const [zone, setZone]             = useState('')
  const [search, setSearch]         = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [alert, setAlert]           = useState(null)

  const fetchSlots = useCallback(async () => {
    try {
      const q = zone ? `?zone=${zone}` : ''
      const { data } = await api.get(`/slots${q}`)
      setSlots(data)
    } catch {
      setAlert({ message: 'Impossible de charger les places', type: 'error' })
    }
  }, [zone])

  useFocusEffect(useCallback(() => { fetchSlots() }, [fetchSlots]))

  const onRefresh = async () => { setRefreshing(true); await fetchSlots(); setRefreshing(false) }

  const filtered = slots.filter(s =>
    s.slot_code.toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    available:   slots.filter(s => s.status === 'available').length,
    occupied:    slots.filter(s => s.status === 'occupied').length,
    maintenance: slots.filter(s => s.status === 'maintenance').length,
  }

  const s = makeStyles(colors)

  return React.createElement(View, { style: s.container },
    React.createElement(StatusBar, { style: isDark ? 'light' : 'dark' }),

    // Fixed header
    React.createElement(View, { style: s.header },
      React.createElement(Text, { style: s.headerTitle }, 'Places de parking'),
      React.createElement(View, { style: [s.onlinePill, { backgroundColor: colors.greenLight }] },
        React.createElement(View, { style: [s.onlineDot, { backgroundColor: colors.green }] }),
        React.createElement(Text, { style: [s.onlineText, { color: colors.green }] },
          `${counts.available} dispo`
        )
      )
    ),

    // Stats mini row
    React.createElement(View, { style: s.statsRow },
      ...[
        { label: 'Disponibles', val: counts.available,   color: colors.green   },
        { label: 'Occupées',    val: counts.occupied,    color: colors.primary },
        { label: 'Maintenance', val: counts.maintenance, color: colors.orange  },
      ].map(item =>
        React.createElement(View, { key: item.label, style: [s.statBox, { backgroundColor: colors.surface, borderColor: colors.border }] },
          React.createElement(Text, { style: [s.statVal, { color: item.color }] }, item.val),
          React.createElement(Text, { style: [s.statLabel, { color: colors.textMuted }] }, item.label)
        )
      )
    ),

    alert && React.createElement(AlertBanner, {
      message: alert.message, type: alert.type, onDismiss: () => setAlert(null)
    }),

    // Search bar
    React.createElement(View, { style: [s.searchWrap, { backgroundColor: colors.surface, borderColor: colors.border }] },
      React.createElement(Text, { style: { fontSize: 16, marginRight: 8 } }, '🔍'),
      React.createElement(TextInput, {
        style: { flex: 1, color: colors.text, fontSize: 14 },
        placeholder: 'Rechercher une place...',
        placeholderTextColor: colors.textMuted,
        value: search,
        onChangeText: setSearch,
        autoCorrect: false,
      })
    ),

    // Zone tabs
    React.createElement(View, { style: s.tabs },
      ...ZONES.map(z =>
        React.createElement(TouchableOpacity, {
          key: z.val,
          onPress: () => setZone(z.val),
          style: [
            s.tab,
            { backgroundColor: zone === z.val ? colors.primary : colors.surface, borderColor: zone === z.val ? colors.primary : colors.border }
          ]
        },
          React.createElement(Text, {
            style: { fontSize: 13, fontWeight: '700', color: zone === z.val ? '#fff' : colors.textMuted }
          }, z.label)
        )
      )
    ),

    // List
    React.createElement(FlatList, {
      data: filtered,
      keyExtractor: item => String(item.id),
      renderItem: ({ item }) => React.createElement(SlotCard, {
        slot: item,
        onPress: () => navigation.navigate('Reservation', { slot: item })
      }),
      contentContainerStyle: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },
      showsVerticalScrollIndicator: false,
      refreshControl: React.createElement(RefreshControl, { refreshing, onRefresh, tintColor: colors.primary }),
      ListEmptyComponent: React.createElement(View, { style: s.empty },
        React.createElement(Text, { style: { fontSize: 48, marginBottom: 12 } }, '🅿'),
        React.createElement(Text, { style: [s.emptyTitle, { color: colors.text }] }, 'Aucune place trouvée'),
        React.createElement(Text, { style: [s.emptySub, { color: colors.textMuted }] }, 'Tirez vers le bas pour actualiser')
      )
    })
  )
}

const makeStyles = c => StyleSheet.create({
  container:   { flex: 1, backgroundColor: c.bg },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 58, paddingBottom: 14 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: c.text },
  onlinePill:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  onlineDot:   { width: 7, height: 7, borderRadius: 4 },
  onlineText:  { fontSize: 12, fontWeight: '700' },
  statsRow:    { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 10 },
  statBox:     { flex: 1, borderRadius: 12, borderWidth: 1, padding: 10, alignItems: 'center' },
  statVal:     { fontSize: 20, fontWeight: '900' },
  statLabel:   { fontSize: 10, fontWeight: '600', marginTop: 2 },
  searchWrap:  { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, padding: 12, borderRadius: 13, borderWidth: 1.5 },
  tabs:        { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  tab:         { flex: 1, paddingVertical: 8, borderRadius: 12, borderWidth: 1.5, alignItems: 'center' },
  empty:       { alignItems: 'center', paddingTop: 70 },
  emptyTitle:  { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  emptySub:    { fontSize: 13 },
})