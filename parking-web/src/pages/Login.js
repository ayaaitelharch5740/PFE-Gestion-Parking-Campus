import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.js'
import api from '../api/axios.js'
const h = React.createElement

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally { setLoading(false) }
  }

  return h('div', {
    className: 'min-h-screen flex',
    style: { background: '#f4f6f9' }
  },

    // Left decorative panel
    h('div', {
      className: 'hidden lg:flex flex-col justify-between w-2/5 p-12 text-white',
      style: { background: 'linear-gradient(160deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)' }
    },
      h('div', null,
        h('div', { className: 'w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl font-bold mb-12' }, 'P'),
        h('h1', { className: 'font-serif italic text-4xl leading-tight mb-4' }, 'Bienvenue sur ParkCampus'),
        h('p', { className: 'text-blue-100 text-sm leading-relaxed max-w-xs' },
          'Plateforme de gestion intelligente du parking universitaire. Réservations, places, utilisateurs — tout en un.'
        )
      ),
      // Decorative slots preview
      h('div', { className: 'space-y-2 opacity-30' },
        ...['A-01','A-02','A-03','B-01','B-02'].map((code, i) =>
          h('div', { key: i, className: 'flex items-center gap-2' },
            h('div', { className: 'w-12 h-6 bg-white/30 rounded text-xs flex items-center justify-center font-mono' }, code),
            h('div', { className: 'flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden' },
              h('div', { className: 'h-full bg-white/60 rounded-full', style: { width: `${30 + i * 15}%` } })
            )
          )
        )
      )
    ),

    // Right form panel
    h('div', { className: 'flex-1 flex items-center justify-center p-8' },
      h('div', { className: 'w-full max-w-sm' },

        h('div', { className: 'mb-8' },
          h('h2', { className: 'text-2xl font-bold text-ink-900 mb-1' }, 'Connexion'),
          h('p', { className: 'text-sm text-ink-300' }, 'Accédez à votre espace administration')
        ),

        h('form', { onSubmit: handleSubmit, className: 'space-y-4' },

          error && h('div', {
            className: 'flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3'
          },
            h('span', null, '⚠'),
            error
          ),

          h('div', { className: 'space-y-1' },
            h('label', { className: 'block text-xs font-semibold text-ink-700 uppercase tracking-wider' }, 'Email'),
            h('input', {
              type: 'email', required: true,
              className: 'input-field',
              placeholder: 'admin@ens.ma',
              value: form.email,
              onChange: e => setForm({ ...form, email: e.target.value })
            })
          ),

          h('div', { className: 'space-y-1' },
            h('label', { className: 'block text-xs font-semibold text-ink-700 uppercase tracking-wider' }, 'Mot de passe'),
            h('input', {
              type: 'password', required: true,
              className: 'input-field',
              placeholder: '••••••••',
              value: form.password,
              onChange: e => setForm({ ...form, password: e.target.value })
            })
          ),

          h('button', {
            type: 'submit',
            disabled: loading,
            className: 'btn-primary w-full mt-2',
            style: { padding: '12px' }
          }, loading
            ? h('span', { className: 'flex items-center justify-center gap-2' },
                h('span', { className: 'w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block' }),
                'Connexion...'
              )
            : 'Se connecter'
          )
        ),

        h('p', { className: 'text-center text-xs text-ink-300 mt-6' },
          'ParkCampus v1.0 — Administration'
        )
      )
    )
  )
}