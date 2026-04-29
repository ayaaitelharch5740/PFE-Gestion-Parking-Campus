import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Platform
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { StatusBar }  from 'expo-status-bar'
import { useTheme }   from '../context/ThemeContext.js'
import api            from '../api/axios.js'
import AlertBanner    from '../components/AlertBanner.js'

export default function ReservationScreen({ route, navigation }) {
  const { colors, isDark } = useTheme()
  const { slot }           = route.params

  const now        = new Date()
  const defaultEnd = new Date(now.getTime() + 2 * 3600000)

  const [startTime,  setStartTime]  = useState(now)
  const [endTime,    setEndTime]    = useState(defaultEnd)
  const [vehicleId,  setVehicleId]  = useState(null)
  const [vehicles,   setVehicles]   = useState([])
  const [loading,    setLoading]    = useState(false)
  const [alert,      setAlert]      = useState(null)
  const [showPicker, setShowPicker] = useState(null) // 'start' | 'end' | null

  useEffect(() => {
    api.get('/vehicles')
      .then(r => { setVehicles(r.data); if (r.data.length) setVehicleId(r.data[0].id) })
      .catch(() => setAlert({ message: 'Impossible de charger vos véhicules', type: 'error' }))
  }, [])

  const handleReserve = async () => {
    if (!vehicleId) return setAlert({ message: 'Sélectionnez un véhicule', type: 'warning' })
    if (endTime <= startTime) return setAlert({ message: 'L\'heure de fin doit être après le début', type: 'error' })
    setLoading(true)
    try {
      await api.post('/reservations', {
        vehicle_id: vehicleId,
        slot_id:    slot.id,
        start_time: startTime.toISOString(),
        end_time:   endTime.toISOString(),
      })
      setAlert({ message: '✅ Réservation confirmée !', type: 'success' })
      setTimeout(() => navigation.goBack(), 1800)
    } catch (err) {
      setAlert({ message: err.response?.data?.message ?? 'Créneau déjà réservé', type: 'error' })
    } finally { setLoading(false) }
  }

  const fmt  = d => d.toLocaleString('fr-MA', { dateStyle: 'short', timeStyle: 'short' })
  const diff = Math.max(0, ((endTime - startTime) / 3600000).toFixed(1))
  const s    = makeStyles(colors)

  return React.createElement(View, { style: s.container },
    React.createElement(StatusBar, { style: isDark ? 'light' : 'dark' }),
    React.createElement(ScrollView, { contentContainerStyle: s.scroll, showsVerticalScrollIndicator: false },

      // Header
      React.createElement(View, { style: s.topBar },
        React.createElement(TouchableOpacity, { onPress: () => navigation.goBack(), hitSlop: { top: 10, bottom: 10, left: 10, right: 10 } },
          React.createElement(Text, { style: [s.backBtn, { color: colors.primary }] }, '← Retour')
        ),
        React.createElement(Text, { style: s.screenTitle }, 'Nouvelle réservation')
      ),

      // Slot hero card
      React.createElement(View, { style: [s.slotCard, { backgroundColor: colors.primary }] },
        React.createElement(View, { style: s.slotCardInner },
          React.createElement(View, { style: s.slotCodeBox },
            React.createElement(Text, { style: s.slotCodeText }, slot.slot_code)
          ),
          React.createElement(View, { style: { flex: 1 } },
            React.createElement(Text, { style: s.slotZone }, `Zone ${slot.zone}`),
            React.createElement(Text, { style: s.slotType },
              { student: '🎓 Étudiant', staff: '👔 Personnel', visitor: '🙋 Visiteur' }[slot.type] ?? slot.type
            )
          ),
          React.createElement(View, { style: s.availBadge },
            React.createElement(Text, { style: s.availText }, '✓ Disponible')
          )
        )
      ),

      alert && React.createElement(AlertBanner, {
        message: alert.message, type: alert.type, onDismiss: () => setAlert(null)
      }),

      // Vehicle selection
      React.createElement(Text, { style: s.sectionTitle }, 'Véhicule'),
      vehicles.length === 0
        ? React.createElement(View, { style: [s.warnBox, { backgroundColor: colors.yellowLight, borderColor: colors.yellow }] },
            React.createElement(Text, { style: [s.warnText, { color: colors.yellow }] },
              '⚠  Aucun véhicule enregistré. Ajoutez-en un dans l\'onglet Véhicules.'
            )
          )
        : React.createElement(View, { style: s.vehicleList },
            ...vehicles.map(v =>
              React.createElement(TouchableOpacity, {
                key: v.id,
                onPress: () => setVehicleId(v.id),
                style: [
                  s.vehicleChip,
                  {
                    backgroundColor: vehicleId === v.id ? colors.primaryLight : colors.surface,
                    borderColor:     vehicleId === v.id ? colors.primary : colors.border,
                  }
                ]
              },
                React.createElement(Text, { style: { fontSize: 20 } },
                  v.type === 'moto' ? '🏍' : v.type === 'truck' ? '🚛' : '🚗'
                ),
                React.createElement(Text, { style: [s.vehiclePlate, { color: vehicleId === v.id ? colors.primary : colors.text }] },
                  v.plate_number
                )
              )
            )
          ),

      // Date/time
      React.createElement(Text, { style: s.sectionTitle }, 'Créneau horaire'),
      React.createElement(View, { style: s.timeRow },
        React.createElement(TouchableOpacity, {
          onPress: () => setShowPicker('start'),
          style: [s.timeBox, { backgroundColor: colors.surface, borderColor: colors.border }]
        },
          React.createElement(Text, { style: { fontSize: 24, marginBottom: 6 } }, '🕐'),
          React.createElement(Text, { style: [s.timeBoxLabel, { color: colors.textMuted }] }, 'DÉBUT'),
          React.createElement(Text, { style: [s.timeBoxVal, { color: colors.text }] }, fmt(startTime))
        ),
        React.createElement(Text, { style: [s.timeArrow, { color: colors.textMuted }] }, '→'),
        React.createElement(TouchableOpacity, {
          onPress: () => setShowPicker('end'),
          style: [s.timeBox, { backgroundColor: colors.surface, borderColor: colors.border }]
        },
          React.createElement(Text, { style: { fontSize: 24, marginBottom: 6 } }, '🕔'),
          React.createElement(Text, { style: [s.timeBoxLabel, { color: colors.textMuted }] }, 'FIN'),
          React.createElement(Text, { style: [s.timeBoxVal, { color: colors.text }] }, fmt(endTime))
        )
      ),

      showPicker && React.createElement(DateTimePicker, {
        value:       showPicker === 'start' ? startTime : endTime,
        mode:        'datetime',
        display:     Platform.OS === 'ios' ? 'spinner' : 'default',
        minimumDate: new Date(),
        onChange:    (_, date) => {
          setShowPicker(null)
          if (!date) return
          showPicker === 'start' ? setStartTime(date) : setEndTime(date)
        }
      }),

      // Duration pill
      React.createElement(View, { style: [s.durationPill, { backgroundColor: colors.primaryLight }] },
        React.createElement(Text, { style: [s.durationText, { color: colors.primary }] },
          `⏱  Durée estimée : ${diff} heure(s)`
        )
      ),

      // Submit
      React.createElement(TouchableOpacity, {
        style: [s.submitBtn, { backgroundColor: colors.primary }, (loading || !vehicleId) && { opacity: 0.6 }],
        onPress: handleReserve,
        disabled: loading || !vehicleId,
        activeOpacity: 0.82,
      },
        React.createElement(Text, { style: s.submitText }, loading ? 'Réservation en cours...' : 'Confirmer la réservation')
      )
    )
  )
}

const makeStyles = c => StyleSheet.create({
  container:    { flex: 1, backgroundColor: c.bg },
  scroll:       { padding: 20, paddingTop: 56, paddingBottom: 48 },
  topBar:       { marginBottom: 22 },
  backBtn:      { fontSize: 14, fontWeight: '700', marginBottom: 14 },
  screenTitle:  { fontSize: 24, fontWeight: '900', color: c.text },
  slotCard:     { borderRadius: 18, padding: 20, marginBottom: 22 },
  slotCardInner:{ flexDirection: 'row', alignItems: 'center', gap: 14 },
  slotCodeBox:  { width: 58, height: 58, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  slotCodeText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  slotZone:     { color: '#fff', fontSize: 18, fontWeight: '800' },
  slotType:     { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 3 },
  availBadge:   { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  availText:    { color: '#fff', fontSize: 11, fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: c.text, marginBottom: 12, marginTop: 4 },
  warnBox:      { borderWidth: 1, borderRadius: 13, padding: 14, marginBottom: 18 },
  warnText:     { fontSize: 13, fontWeight: '600', lineHeight: 19 },
  vehicleList:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  vehicleChip:  { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  vehiclePlate: { fontSize: 14, fontWeight: '800' },
  timeRow:      { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  timeBox:      { flex: 1, borderWidth: 1.5, borderRadius: 14, padding: 14, alignItems: 'center' },
  timeBoxLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, marginBottom: 5 },
  timeBoxVal:   { fontSize: 13, fontWeight: '700', textAlign: 'center' },
  timeArrow:    { fontSize: 20 },
  durationPill: { borderRadius: 13, padding: 13, marginBottom: 22, alignItems: 'center' },
  durationText: { fontSize: 14, fontWeight: '700' },
  submitBtn:    { borderRadius: 16, padding: 17, alignItems: 'center' },
  submitText:   { color: '#fff', fontSize: 16, fontWeight: '900' },
})