import React, { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext.js'
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, RefreshControl
} from 'react-native'
import { StatusBar }      from 'expo-status-bar'
import { useFocusEffect } from '@react-navigation/native'
import { useTheme }       from '../context/ThemeContext.js'
import api                from '../api/axios.js'
import VehicleCard        from '../components/VehicleCard.js'
import AlertBanner        from '../components/AlertBanner.js'

const VEHICLE_TYPES = [
  { val: 'car',   icon: '🚗', label: 'Voiture' },
  { val: 'moto',  icon: '🏍', label: 'Moto'    },
  { val: 'truck', icon: '🚛', label: 'Camion'  },
]

export default function VehiclesScreen() {
  const { colors, isDark } = useTheme()
  const { logout } = useAuth()
  const [vehicles,   setVehicles]   = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [showForm,   setShowForm]   = useState(false)
  const [form, setForm]             = useState({ plate_number: '', type: 'car', brand: '' })
  const [loading,    setLoading]    = useState(false)
  const [alert,      setAlert]      = useState(null)

  const fetchVehicles = useCallback(async () => {
    try {
      const { data } = await api.get('/vehicles')
      setVehicles(data)
    } catch { setAlert({ message: 'Erreur chargement véhicules', type: 'error' }) }
  }, [])

  useFocusEffect(useCallback(() => { fetchVehicles() }, [fetchVehicles]))

  const onRefresh = async () => { setRefreshing(true); await fetchVehicles(); setRefreshing(false) }

  const handleAdd = async () => {
    if (!form.plate_number.trim())
      return setAlert({ message: 'Entrez un numéro de plaque', type: 'warning' })
    setLoading(true)
    try {
      await api.post('/vehicles', form)
      setAlert({ message: 'Véhicule ajouté avec succès !', type: 'success' })
      setForm({ plate_number: '', type: 'car', brand: '' })
      setShowForm(false)
      fetchVehicles()
    } catch (err) {
      setAlert({ message: err.response?.data?.message ?? 'Erreur lors de l\'ajout', type: 'error' })
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/vehicles/${id}`)
      setAlert({ message: 'Véhicule supprimé', type: 'success' })
      fetchVehicles()
    } catch {
      setAlert({ message: 'Impossible de supprimer ce véhicule', type: 'error' })
    }
  }

  const s = makeStyles(colors)

  return React.createElement(View, { style: s.container },
    React.createElement(StatusBar, { style: isDark ? 'light' : 'dark' }),

    // Header
   React.createElement(View, { style: s.header },
  React.createElement(View, null,
    React.createElement(Text, { style: s.title }, 'Mes véhicules'),
    React.createElement(Text, { style: [s.sub, { color: colors.textMuted }] }, `${vehicles.length} enregistré(s)`)
  ),

  React.createElement(View, { style: { flexDirection: 'row', gap: 8 } },

    // Bouton logout
    React.createElement(TouchableOpacity, {
      onPress: logout,
      style: [s.logoutBtn, { backgroundColor: colors.redLight }]
    },
      React.createElement(Text, {
        style: { color: colors.red, fontSize: 12, fontWeight: '700' }
      }, '⎋ Sortir')
    ),

    // Bouton +
    React.createElement(TouchableOpacity, {
      onPress: () => setShowForm(!showForm),
      style: [s.addBtn, { backgroundColor: showForm ? colors.surfaceAlt : colors.primary }]
    },
      React.createElement(Text, {
        style: { color: showForm ? colors.textMuted : '#fff', fontSize: 22, fontWeight: '900' }
      },
        showForm ? '−' : '+'
      )
    )
  )
),

    alert && React.createElement(AlertBanner, {
      message: alert.message, type: alert.type, onDismiss: () => setAlert(null)
    }),

    // Add form
    showForm && React.createElement(View, { style: [s.form, { backgroundColor: colors.surface, borderColor: colors.primaryLight }] },
      React.createElement(Text, { style: [s.formTitle, { color: colors.text }] }, '+ Nouveau véhicule'),

      React.createElement(Text, { style: s.label }, 'PLAQUE D\'IMMATRICULATION *'),
      React.createElement(TextInput, {
        style: [s.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }],
        placeholder: 'ex: A-12345-B',
        placeholderTextColor: colors.textMuted,
        autoCapitalize: 'characters',
        autoCorrect: false,
        value: form.plate_number,
        onChangeText: t => setForm({ ...form, plate_number: t }),
      }),

      React.createElement(Text, { style: s.label }, 'TYPE DE VÉHICULE'),
      React.createElement(View, { style: s.typeRow },
        ...VEHICLE_TYPES.map(t =>
          React.createElement(TouchableOpacity, {
            key: t.val,
            onPress: () => setForm({ ...form, type: t.val }),
            style: [
              s.typeChip,
              {
                backgroundColor: form.type === t.val ? colors.primaryLight : colors.surfaceAlt,
                borderColor:     form.type === t.val ? colors.primary : colors.border,
              }
            ]
          },
            React.createElement(Text, { style: { fontSize: 18 } }, t.icon),
            React.createElement(Text, { style: [s.typeLabel, { color: form.type === t.val ? colors.primary : colors.textMuted }] }, t.label)
          )
        )
      ),

      React.createElement(Text, { style: s.label }, 'MARQUE (optionnel)'),
      React.createElement(TextInput, {
        style: [s.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }],
        placeholder: 'ex: Dacia, Renault, Yamaha...',
        placeholderTextColor: colors.textMuted,
        value: form.brand,
        onChangeText: t => setForm({ ...form, brand: t }),
      }),

      React.createElement(View, { style: s.formActions },
        React.createElement(TouchableOpacity, {
          onPress: handleAdd,
          disabled: loading,
          style: [s.submitBtn, { backgroundColor: colors.primary }, loading && { opacity: 0.65 }]
        },
          React.createElement(Text, { style: s.submitText }, loading ? 'Ajout...' : 'Ajouter')
        ),
        React.createElement(TouchableOpacity, {
          onPress: () => setShowForm(false),
          style: [s.cancelBtn, { borderColor: colors.border }]
        },
          React.createElement(Text, { style: [s.cancelText, { color: colors.textMuted }] }, 'Annuler')
        )
      )
    ),

    React.createElement(FlatList, {
      data: vehicles,
      keyExtractor: item => String(item.id),
      renderItem: ({ item }) => React.createElement(VehicleCard, { vehicle: item, onDelete: handleDelete }),
      contentContainerStyle: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },
      showsVerticalScrollIndicator: false,
      refreshControl: React.createElement(RefreshControl, { refreshing, onRefresh, tintColor: colors.primary }),
      ListEmptyComponent: React.createElement(View, { style: s.empty },
        React.createElement(Text, { style: { fontSize: 48, marginBottom: 14 } }, '🚗'),
        React.createElement(Text, { style: [s.emptyTitle, { color: colors.text }] }, 'Aucun véhicule'),
        React.createElement(Text, { style: [s.emptySub, { color: colors.textMuted }] }, 'Appuyez sur + pour en ajouter un')
      )
    })
  )
}

const makeStyles = c => StyleSheet.create({
  container:   { flex: 1, backgroundColor: c.bg },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 58, paddingBottom: 14 },
  title:       { fontSize: 22, fontWeight: '900', color: c.text },
  sub:         { fontSize: 13, marginTop: 2 },
  addBtn:      { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  form:        { marginHorizontal: 16, marginBottom: 14, padding: 18, borderRadius: 18, borderWidth: 1.5, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  formTitle:   { fontSize: 16, fontWeight: '800', marginBottom: 18 },
  label:       { fontSize: 10, fontWeight: '700', color: c.textMuted, letterSpacing: 1.2, marginBottom: 7 },
  input:       { borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 16 },
  typeRow:     { flexDirection: 'row', gap: 8, marginBottom: 16 },
  typeChip:    { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderRadius: 12, paddingVertical: 10 },
  typeLabel:   { fontSize: 12, fontWeight: '700' },
  formActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  submitBtn:   { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  submitText:  { color: '#fff', fontWeight: '800', fontSize: 14 },
  cancelBtn:   { flex: 1, borderRadius: 12, padding: 14, alignItems: 'center', borderWidth: 1.5 },
  cancelText:  { fontWeight: '700', fontSize: 14 },
  empty:       { alignItems: 'center', paddingTop: 72 },
  emptyTitle:  { fontSize: 17, fontWeight: '800', marginBottom: 5 },
  emptySub:    { fontSize: 13 },
  logoutBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
})