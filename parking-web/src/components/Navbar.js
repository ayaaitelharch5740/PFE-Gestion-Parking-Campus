import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.js'
const h = React.createElement

const links = [
  { to: '/',             icon: '▦',  label: 'Tableau de bord ' },
  { to: '/slots',        icon: '⊞',  label: 'Places' },
  { to: '/reservations', icon: '◷',  label: 'Réservations', roles: ['admin','agent'] },
  { to: '/users',        icon: '◉',  label: 'Utilisateurs', roles: ['admin'] },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return h('aside', {
    className: 'fixed left-0 top-0 h-full w-60 bg-white border-r border-border flex flex-col z-50',
    style: { boxShadow: '1px 0 0 #e8ecf2' }
  },

    // Logo
    h('div', { className: 'px-6 py-5 border-b border-border flex items-center gap-3' },
      h('div', {
        className: 'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm',
        style: { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', boxShadow: '0 2px 8px rgba(37,99,235,0.35)' }
      }, 'P'),
      h('div', null,
        h('p', { className: 'font-bold text-ink-900 text-sm leading-none' }, 'ParkCampus'),
        h('p', { className: 'text-xs text-ink-300 mt-0.5' }, 'Administration')
      )
    ),

    // Section nav
    h('div', { className: 'px-3 pt-4 pb-2' },
      h('p', { className: 'text-xs font-semibold text-ink-300 uppercase tracking-widest px-3 mb-2' }, 'Menu')
    ),

    h('nav', { className: 'flex-1 px-3 space-y-0.5' },
      ...links
        .filter(l => !l.roles || l.roles.includes(user?.role))
        .map(l =>
          h(NavLink, {
            key: l.to,
            to: l.to,
            end: l.to === '/',
            className: ({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-blue'
                  : 'text-ink-500 hover:bg-bg hover:text-ink-900'
              }`
          },
            h('span', { style: { fontSize: 15 } }, l.icon),
            l.label
          )
        )
    ),

    // User footer
    h('div', { className: 'px-3 pb-4 pt-3 border-t border-border mt-2' },
      h('div', { className: 'flex items-center gap-3 px-3 py-2.5 rounded-xl bg-bg mb-1' },
        h('div', {
          className: 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0',
          style: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }
        }, user?.name?.[0]?.toUpperCase()),
        h('div', { className: 'overflow-hidden flex-1' },
          h('p', { className: 'text-sm font-semibold text-ink-900 truncate leading-none' }, user?.name),
          h('p', { className: 'text-xs text-ink-300 mt-0.5 capitalize' }, user?.role)
        )
      ),
      h('button', {
        onClick: handleLogout,
        className: 'w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-ink-300 hover:text-red-500 hover:bg-red-50 transition-all'
      },
        h('span', null, '⎋'),
        'Se déconnecter'
      )
    )
  )
}