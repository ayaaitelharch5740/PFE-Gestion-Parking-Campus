import React, { useState, useEffect } from 'react'
import api from '../api/axios.js'
const h = React.createElement

const roleIcon = { admin: '', agent: '', user: '' }

export default function Users() {
  const [users, setUsers]   = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data)).catch(() => {})
  }, [])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    admin: users.filter(u => u.role === 'admin').length,
    agent: users.filter(u => u.role === 'agent').length,
    user:  users.filter(u => u.role === 'user').length,
  }

  return h('div', { className: 'space-y-5 animate-in' },

    // Header
    h('div', { className: 'flex items-start justify-between' },
      h('div', null,
        h('h1', { className: 'text-2xl font-bold text-ink-900' }, 'Utilisateurs'),
        h('p', { className: 'text-sm text-ink-300 mt-0.5' }, `${users.length} comptes enregistrés`)
      )
    ),

    // Summary pills
    h('div', { className: 'flex gap-3 flex-wrap' },
      ...Object.entries(counts).map(([role, count]) =>
        h('div', { key: role, className: 'card px-4 py-2.5 flex items-center gap-2' },
          h('span', null, roleIcon[role]),
          h('span', { className: 'text-xs font-semibold text-ink-700 capitalize' }, role),
          h('span', { className: `badge badge-${role}` }, count)
        )
      )
    ),

    // Search
    h('div', { className: 'relative' },
      h('span', {
        className: 'absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-300 text-sm pointer-events-none'
      }, '🔍'),
      h('input', {
        className: 'input-field pl-9',
        placeholder: 'Rechercher par nom ou email...',
        value: search,
        onChange: e => setSearch(e.target.value)
      })
    ),

    // Users grid
    h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' },
      ...filtered.map((u, i) =>
        h('div', {
          key: u.id,
          className: `card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all animate-in`,
          style: { animationDelay: `${i * 0.04}s` }
        },
          h('div', { className: 'flex items-start gap-3 mb-4' },
            h('div', {
              className: 'w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold text-white flex-shrink-0',
              style: {
                background: u.role === 'admin'
                  ? 'linear-gradient(135deg,#7c3aed,#6d28d9)'
                  : u.role === 'agent'
                    ? 'linear-gradient(135deg,#2563eb,#1d4ed8)'
                    : 'linear-gradient(135deg,#0891b2,#0e7490)'
              }
            }, u.name?.[0]?.toUpperCase()),
            h('div', { className: 'flex-1 overflow-hidden' },
              h('p', { className: 'font-semibold text-ink-900 text-sm leading-none' }, u.name),
              h('p', { className: 'text-xs text-ink-300 mt-1 truncate' }, u.email)
            )
          ),
          h('div', { className: 'flex items-center justify-between pt-3.5 border-t border-border' },
            h('span', { className: `badge badge-${u.role} flex items-center gap-1` },
              roleIcon[u.role], ` ${u.role}`
            ),
            h('span', { className: 'text-xs text-ink-300' },
              new Date(u.created_at).toLocaleDateString('fr-MA')
            )
          )
        )
      )
    ),

    !filtered.length && h('div', { className: 'text-center py-14 text-ink-300' },
      h('p', { className: 'text-3xl mb-2' }, '👥'),
      h('p', { className: 'text-sm' }, 'Aucun utilisateur trouvé')
    )
  )
}