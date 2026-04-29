import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useAuth }  from '../context/AuthContext.js'
import { useTheme } from '../context/ThemeContext.js'
import api from '../api/axios.js'
import AlertBanner from '../components/AlertBanner.js'

export default function RegisterScreen({ navigation }) {
  const { login }  = useAuth()
  const { colors, isDark } = useTheme()
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert]     = useState(null)

  const handleRegister = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.password)
      return setAlert({ message: 'Remplissez tous les champs obligatoires', type: 'warning' })
    if (form.password.length < 6)
      return setAlert({ message: 'Mot de passe trop court (6 caractères minimum)', type: 'warning' })
    if (form.password !== form.confirm)
      return setAlert({ message: 'Les mots de passe ne correspondent pas', type: 'error' })

    setLoading(true)
    try {
      await api.post('/auth/register', { name: form.name, email: form.email, password: form.password })
      const { data } = await api.post('/auth/login',    { email: form.email, password: form.password })
      await login(data.token, data.user)
    } catch (err) {
      setAlert({ message: err.response?.data?.message ?? 'Erreur lors de l\'inscription', type: 'error' })
    } finally { setLoading(false) }
  }

  const s = makeStyles(colors)

  const FIELDS = [
    { key: 'name',     label: 'NOM COMPLET',          placeholder: 'Youssef Alami',  secure: false, kb: 'default' },
    { key: 'email',    label: 'EMAIL',                 placeholder: 'you@ens.ma',     secure: false, kb: 'email-address' },
    { key: 'password', label: 'MOT DE PASSE',          placeholder: '••••••••',       secure: true,  kb: 'default' },
    { key: 'confirm',  label: 'CONFIRMER MOT DE PASSE',placeholder: '••••••••',       secure: true,  kb: 'default' },
  ]

  return React.createElement(KeyboardAvoidingView,
    { style: { flex: 1, backgroundColor: colors.bg }, behavior: Platform.OS === 'ios' ? 'padding' : 'height' },
    React.createElement(StatusBar, { style: isDark ? 'light' : 'dark' }),

    React.createElement(ScrollView,
      { contentContainerStyle: s.scroll, keyboardShouldPersistTaps: 'handled', showsVerticalScrollIndicator: false },

      // Back
      React.createElement(View, { style: s.topBar },
        React.createElement(TouchableOpacity, { onPress: () => navigation.goBack(), hitSlop: { top: 10, bottom: 10, left: 10, right: 10 } },
          React.createElement(Text, { style: [s.backBtn, { color: colors.primary }] }, '← Retour')
        )
      ),

      React.createElement(Text, { style: s.title }, 'Créer un compte'),
      React.createElement(Text, { style: [s.sub, { color: colors.textMuted }] }, 'Rejoignez ParkCampus gratuitement'),

      React.createElement(View, { style: s.card },

        alert && React.createElement(AlertBanner, {
          message: alert.message, type: alert.type, onDismiss: () => setAlert(null)
        }),

        ...FIELDS.map(f =>
          React.createElement(View, { key: f.key },
            React.createElement(Text, { style: s.label }, f.label),
            React.createElement(TextInput, {
              style: s.input,
              placeholder: f.placeholder,
              placeholderTextColor: colors.textMuted,
              secureTextEntry: f.secure,
              keyboardType: f.kb,
              autoCapitalize: 'none',
              autoCorrect: false,
              value: form[f.key],
              onChangeText: t => setForm({ ...form, [f.key]: t }),
            })
          )
        ),

        React.createElement(TouchableOpacity, {
          style: [s.btn, { backgroundColor: colors.primary }, loading && { opacity: 0.65 }],
          onPress: handleRegister,
          disabled: loading,
          activeOpacity: 0.82,
        },
          React.createElement(Text, { style: s.btnText }, loading ? 'Création...' : 'Créer mon compte')
        )
      )
    )
  )
}

const makeStyles = c => StyleSheet.create({
  scroll:  { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 40 },
  topBar:  { paddingTop: 60, paddingBottom: 10 },
  backBtn: { fontSize: 14, fontWeight: '700' },
  title:   { fontSize: 26, fontWeight: '900', color: c.text, marginBottom: 4 },
  sub:     { fontSize: 13, marginBottom: 24 },
  card:    { backgroundColor: c.surface, borderRadius: 22, padding: 22, borderWidth: 1, borderColor: c.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4 },
  label:   { fontSize: 10, fontWeight: '700', color: c.textMuted, letterSpacing: 1.2, marginBottom: 7 },
  input:   { backgroundColor: c.surfaceAlt, borderWidth: 1.5, borderColor: c.border, borderRadius: 13, paddingHorizontal: 15, paddingVertical: 13, fontSize: 14, color: c.text, marginBottom: 16 },
  btn:     { borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 6 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
})