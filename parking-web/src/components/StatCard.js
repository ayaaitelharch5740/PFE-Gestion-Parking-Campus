import React from 'react'
const h = React.createElement

const themes = {
  blue:   { bg: '#eff6ff', icon: '#2563eb', val: '#1a2332', border: '#bfdbfe' },
  green:  { bg: '#f0fdf4', icon: '#16a34a', val: '#1a2332', border: '#bbf7d0' },
  orange: { bg: '#fff7ed', icon: '#ea580c', val: '#1a2332', border: '#fed7aa' },
  violet: { bg: '#f5f3ff', icon: '#7c3aed', val: '#1a2332', border: '#ddd6fe' },
}

export default function StatCard({ icon, label, value, color = 'blue', delay = '' }) {
  const t = themes[color]
  return h('div', {
    className: `animate-in ${delay} bg-white rounded-xl2 p-5 border flex items-start gap-4`,
    style: { borderColor: t.border, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)' }
  },
    h('div', {
      className: 'w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
      style: { background: t.bg, color: t.icon }
    }, icon),
    h('div', null,
      h('p', { className: 'text-xs font-semibold text-ink-300 uppercase tracking-wider leading-none' }, label),
      h('p', { className: 'text-3xl font-bold text-ink-900 mt-1.5 leading-none font-serif' }, value)
    )
  )
}