import React, { useState, useEffect } from 'react'
import api from '../api/axios.js'
import SlotGrid from '../components/SlotGrid.js'
const h = React.createElement

export default function Slots() {
  const [slots, setSlots]     = useState([])
  const [filter, setFilter]   = useState({ zone: '', status: '' })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]       = useState({ slot_code: '', zone: 'A', type: 'student' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]         = useState('')

  const fetchSlots = () => {
    const p = new URLSearchParams(Object.fromEntries(Object.entries(filter).filter(([,v]) => v)))
    api.get(`/slots?${p}`).then(r => setSlots(r.data)).catch(() => {})
  }

  useEffect(() => { fetchSlots() }, [filter])

  const handleToggle = async (slot) => {
    const newStatus = slot.status === 'maintenance' ? 'available' : 'maintenance'
    await api.put(`/slots/${slot.id}`, { ...slot, status: newStatus })
    fetchSlots()
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setLoading(true); setMsg('')
    try {
      await api.post('/slots', form)
      setShowForm(false)
      setForm({ slot_code: '', zone: 'A', type: 'student' })
      fetchSlots()
      setMsg('Place créée avec succès !')
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erreur lors de la création')
    } finally { setLoading(false) }
  }

  const zoneFilters = ['', 'A', 'B', 'C']
  const statusFilters = [
    { val: '', label: 'Tous statuts' },
    { val: 'available', label: 'Disponibles' },
    { val: 'occupied', label: 'Occupées' },
    { val: 'maintenance', label: 'Maintenance' },
  ]

  return h('div', { className: 'space-y-5 animate-in' },

    // Header
    h('div', { className: 'flex items-center justify-between' },
      h('div', null,
        h('h1', { className: 'text-2xl font-bold text-ink-900' }, 'Places de parking'),
        h('p', { className: 'text-sm text-ink-300 mt-0.5' }, `${slots.length} places au total`)
      ),
      h('button', {
        onClick: () => setShowForm(!showForm),
        className: 'btn-primary flex items-center gap-2'
      },
        h('span', { className: 'text-lg leading-none' }, '+'),
        'Ajouter une place'
      )
    ),

    // Message
    msg && h('div', {
      className: `text-sm px-4 py-3 rounded-xl border ${msg.includes('succès')
        ? 'bg-green-50 border-green-200 text-green-700'
        : 'bg-red-50 border-red-200 text-red-600'}`
    }, msg),

    // Add form
    showForm && h('div', {
      className: 'card p-5 border-blue-200 animate-in',
      style: { borderColor: '#bfdbfe' }
    },
      h('h3', { className: 'font-semibold text-ink-900 text-sm mb-4' }, 'Nouvelle place'),
      h('form', { onSubmit: handleCreate, className: 'flex gap-3 items-end flex-wrap' },
        h('div', null,
          h('label', { className: 'block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1' }, 'Code place'),
          h('input', {
            required: true, placeholder: 'ex: A-21',
            value: form.slot_code,
            onChange: e => setForm({ ...form, slot_code: e.target.value }),
            className: 'input-field', style: { width: 120 }
          })
        ),
        h('div', null,
          h('label', { className: 'block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1' }, 'Zone'),
          h('select', {
            value: form.zone,
            onChange: e => setForm({ ...form, zone: e.target.value }),
            className: 'input-field', style: { width: 90 }
          },
            ...['A','B','C'].map(z => h('option', { key: z, value: z }, `Zone ${z}`))
          )
        ),
        h('div', null,
          h('label', { className: 'block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1' }, 'Type'),
          h('select', {
            value: form.type,
            onChange: e => setForm({ ...form, type: e.target.value }),
            className: 'input-field', style: { width: 130 }
          },
            ...['student','staff','visitor'].map(t => h('option', { key: t, value: t }, t))
          )
        ),
        h('div', { className: 'flex gap-2' },
          h('button', { type: 'submit', disabled: loading, className: 'btn-primary' },
            loading ? 'Création...' : 'Créer'
          ),
          h('button', {
            type: 'button',
            onClick: () => setShowForm(false),
            className: 'px-4 py-2 text-sm text-ink-500 hover:text-ink-900 hover:bg-bg rounded-xl transition-all'
          }, 'Annuler')
        )
      )
    ),

    // Filters
    h('div', { className: 'flex gap-2 flex-wrap' },
      ...zoneFilters.map(z =>
        h('button', {
          key: z,
          onClick: () => setFilter(f => ({ ...f, zone: z })),
          className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            filter.zone === z
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-ink-500 border-border hover:border-blue-300 hover:text-blue-600'
          }`
        }, z ? `Zone ${z}` : 'Toutes zones')
      ),
      h('div', { className: 'w-px bg-border mx-1' }),
      ...statusFilters.map(s =>
        h('button', {
          key: s.val,
          onClick: () => setFilter(f => ({ ...f, status: s.val })),
          className: `px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            filter.status === s.val
              ? 'bg-ink-900 text-white border-ink-900'
              : 'bg-white text-ink-500 border-border hover:border-ink-400 hover:text-ink-900'
          }`
        }, s.label)
      )
    ),

    // Grid
    h('div', { className: 'card p-5' },
      slots.length
        ? h(SlotGrid, { slots, onToggleMaintenance: handleToggle })
        : h('div', { className: 'text-center py-12 text-ink-300' },
            h('p', { className: 'text-3xl mb-2' }, '🅿'),
            h('p', { className: 'text-sm' }, 'Aucune place trouvée')
          )
    ),

    h('p', { className: 'text-xs text-ink-300 text-center' },
      'Cliquez sur une place pour basculer son état de maintenance'
    )
  )
}