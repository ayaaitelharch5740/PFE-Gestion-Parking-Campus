import React, { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform
} from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useAuth }  from '../context/AuthContext.js'
import { useTheme } from '../context/ThemeContext.js'
import api from '../api/axios.js'
import AlertBanner from '../components/AlertBanner.js'

export default function LoginScreen({ navigation }) {
  const { login }  = useAuth()
  const { colors, isDark } = useTheme()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert]     = useState(null)

  const handleLogin = async () => {
    if (!form.email.trim() || !form.password)
      return setAlert({ message: 'Veuillez remplir tous les champs', type: 'warning' })
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      await login(data.token, data.user)
    } catch (err) {
      setAlert({ message: err.response?.data?.message ?? 'Email ou mot de passe incorrect', type: 'error' })
    } finally { setLoading(false) }
  }

  const s = makeStyles(colors)

  return React.createElement(KeyboardAvoidingView,
    { style: { flex: 1, backgroundColor: colors.bg }, behavior: Platform.OS === 'ios' ? 'padding' : 'height' },
    React.createElement(StatusBar, { style: isDark ? 'light' : 'dark' }),

    React.createElement(ScrollView,
      { contentContainerStyle: s.scroll, keyboardShouldPersistTaps: 'handled', showsVerticalScrollIndicator: false },

      // Hero
      React.createElement(View, { style: s.hero },
        React.createElement(View, { style: s.logoWrap },
          React.createElement(Text, { style: s.logoLetter }, 'P')
        ),
        React.createElement(Text, { style: s.appName }, 'ParkCampus'),
        React.createElement(Text, { style: s.appTagline }, 'Gestion intelligente du parking')
      ),

      // Form card
      React.createElement(View, { style: s.card },
        React.createElement(Text, { style: s.cardTitle }, 'Connexion'),

        alert && React.createElement(AlertBanner, {
          message: alert.message, type: alert.type, onDismiss: () => setAlert(null)
        }),

        React.createElement(Text, { style: s.label }, 'EMAIL'),
        React.createElement(TextInput, {
          style: s.input,
          placeholder: 'votre@email.ma',
          placeholderTextColor: colors.textMuted,
          keyboardType: 'email-address',
          autoCapitalize: 'none',
          autoCorrect: false,
          value: form.email,
          onChangeText: t => setForm({ ...form, email: t }),
        }),

        React.createElement(Text, { style: s.label }, 'MOT DE PASSE'),
        React.createElement(TextInput, {
          style: s.input,
          placeholder: '••••••••',
          placeholderTextColor: colors.textMuted,
          secureTextEntry: true,
          value: form.password,
          onChangeText: t => setForm({ ...form, password: t }),
          onSubmitEditing: handleLogin,
        }),

        React.createElement(TouchableOpacity, {
          style: [s.btnPrimary, loading && s.btnDisabled],
          onPress: handleLogin,
          disabled: loading,
          activeOpacity: 0.82,
        },
          React.createElement(Text, { style: s.btnText }, loading ? 'Connexion en cours...' : 'Se connecter')
        ),

        React.createElement(View, { style: s.dividerRow },
          React.createElement(View, { style: [s.divLine, { backgroundColor: colors.border }] }),
          React.createElement(Text, { style: [s.divText, { color: colors.textMuted }] }, 'ou'),
          React.createElement(View, { style: [s.divLine, { backgroundColor: colors.border }] })
        ),

        React.createElement(TouchableOpacity, {
          style: [s.btnSecondary, { borderColor: colors.primary }],
          onPress: () => navigation.navigate('Register'),
        },
          React.createElement(Text, { style: [s.btnSecText, { color: colors.primary }] }, 'Créer un compte')
        )
      ),

      React.createElement(Text, { style: [s.footer, { color: colors.textMuted }] }, 'ParkCampus v1.0')
    )
  )
}

const makeStyles = c => StyleSheet.create({
  scroll:      { flexGrow: 1, paddingBottom: 32 },
  hero:        { alignItems: 'center', paddingTop: 72, paddingBottom: 40 },
  logoWrap:    { width: 72, height: 72, borderRadius: 22, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: c.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  logoLetter:  { color: '#fff', fontSize: 30, fontWeight: '900' },
  appName:     { fontSize: 28, fontWeight: '900', color: c.text, marginBottom: 6 },
  appTagline:  { fontSize: 14, color: c.textMuted },
  card:        { marginHorizontal: 20, backgroundColor: c.surface, borderRadius: 22, padding: 24, borderWidth: 1, borderColor: c.border, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 5 },
  cardTitle:   { fontSize: 20, fontWeight: '800', color: c.text, marginBottom: 20 },
  label:       { fontSize: 10, fontWeight: '700', color: c.textMuted, letterSpacing: 1.2, marginBottom: 7 },
  input:       { backgroundColor: c.surfaceAlt, borderWidth: 1.5, borderColor: c.border, borderRadius: 13, paddingHorizontal: 15, paddingVertical: 13, fontSize: 14, color: c.text, marginBottom: 16 },
  btnPrimary:  { backgroundColor: c.primary, borderRadius: 14, padding: 15, alignItems: 'center', marginTop: 4, shadowColor: c.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
  btnDisabled: { opacity: 0.65 },
  btnText:     { color: '#fff', fontSize: 15, fontWeight: '800' },
  dividerRow:  { flexDirection: 'row', alignItems: 'center', marginVertical: 18, gap: 10 },
  divLine:     { flex: 1, height: 1 },
  divText:     { fontSize: 12 },
  btnSecondary:{ borderWidth: 2, borderRadius: 14, padding: 14, alignItems: 'center' },
  btnSecText:  { fontSize: 15, fontWeight: '700' },
  footer:      { textAlign: 'center', fontSize: 11, marginTop: 24 },
})