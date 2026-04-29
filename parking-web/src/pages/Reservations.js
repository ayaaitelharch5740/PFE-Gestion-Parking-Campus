import React, { useState, useEffect } from 'react'
import api from '../api/axios.js'
const h = React.createElement

const COLS = ['#','Utilisateur','Plaque','Place','Zone','Début','Fin','Statut']

export default function Reservations() {
  const [reservations, setReservations] = useState([])
  const [filters, setFilters]           = useState({ plate: '', date: '' })
  const [loading, setLoading]           = useState(false)

  const fetchReservations = async () => {
    setLoading(true)
    const p = new URLSearchParams(Object.fromEntries(Object.entries(filters).filter(([,v]) => v)))
    try {
      const r = await api.get(`/reservations?${p}`)
      setReservations(r.data)
    } catch (e) {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchReservations() }, [])

  const reset = () => {
    setFilters({ plate: '', date: '' })
    api.get('/reservations').then(r => setReservations(r.data)).catch(() => {})
  }

  return h('div', { className: 'space-y-5 animate-in' },

    // Header
    h('div', null,
      h('h1', { className: 'text-2xl font-bold text-ink-900' }, 'Réservations'),
      h('p', { className: 'text-sm text-ink-300 mt-0.5' }, `${reservations.length} réservation(s)`)
    ),

    // Filters bar
    h('div', { className: 'card p-4 flex gap-3 items-end flex-wrap' },
      h('div', { className: 'flex-1 min-w-[200px]' },
        h('label', { className: 'block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1' }, 'Plaque'),
        h('input', {
          className: 'input-field',
          placeholder: 'Rechercher une plaque...',
          value: filters.plate,
          onChange: e => setFilters({ ...filters, plate: e.target.value }),
          onKeyDown: e => e.key === 'Enter' && fetchReservations()
        })
      ),
      h('div', null,
        h('label', { className: 'block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1' }, 'Date'),
        h('input', {
          type: 'date',
          className: 'input-field',
          value: filters.date,
          onChange: e => setFilters({ ...filters, date: e.target.value })
        })
      ),
      h('div', { className: 'flex gap-2' },
        h('button', {
          onClick: fetchReservations,
          className: 'btn-primary'
        }, loading ? '...' : 'Filtrer'),
        h('button', {
          onClick: reset,
          className: 'px-4 py-2 text-sm font-semibold text-ink-500 hover:text-ink-900 bg-bg hover:bg-border rounded-xl transition-all'
        }, 'Réinitialiser')
      )
    ),

    // Table
    h('div', { className: 'card overflow-hidden' },
      h('div', { className: 'overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', { className: 'bg-bg border-b border-border' },
              ...COLS.map(c => h('th', {
                key: c,
                className: 'text-left px-5 py-3 text-xs font-semibold text-ink-300 uppercase tracking-wider'
              }, c))
            )
          ),
          h('tbody', { className: 'divide-y divide-border' },
            ...reservations.map(r =>
              h('tr', { key: r.id, className: 'hover:bg-blue-50/20 transition-colors' },
                h('td', { className: 'px-5 py-3.5 font-mono text-xs text-ink-300' }, `#${r.id}`),
                h('td', { className: 'px-5 py-3.5 font-semibold text-ink-900' }, r.user_name),
                h('td', { className: 'px-5 py-3.5' },
                  h('span', { className: 'font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md' }, r.plate_number)
                ),
                h('td', { className: 'px-5 py-3.5 font-medium text-ink-700' }, r.slot_code),
                h('td', { className: 'px-5 py-3.5' },
                  h('span', { className: 'text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded-md' }, r.zone)
                ),
                h('td', { className: 'px-5 py-3.5 text-ink-400 text-xs whitespace-nowrap' },
                  new Date(r.start_time).toLocaleString('fr-MA', { dateStyle: 'short', timeStyle: 'short' })
                ),
                h('td', { className: 'px-5 py-3.5 text-ink-400 text-xs whitespace-nowrap' },
                  new Date(r.end_time).toLocaleString('fr-MA', { dateStyle: 'short', timeStyle: 'short' })
                ),
                h('td', { className: 'px-5 py-3.5' },
                  h('span', { className: `badge badge-${r.status}` }, r.status)
                )
              )
            )
          )
        ),
        !reservations.length && h('div', { className: 'text-center py-14 text-ink-300' },
          h('p', { className: 'text-3xl mb-2' }, '📋'),
          h('p', { className: 'text-sm font-medium' }, 'Aucune réservation trouvée'),
          h('p', { className: 'text-xs mt-1' }, 'Modifiez vos filtres ou réinitialisez la recherche')
        )
      )
    )
  )
}