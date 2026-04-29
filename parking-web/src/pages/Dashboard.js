import React, { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'
import api from '../api/axios.js'
import StatCard from '../components/StatCard.js'
const h = React.createElement

const PIE_COLORS = ['#22c55e', '#3b82f6', '#f97316']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return h('div', {
    className: 'bg-white border border-border rounded-xl px-3 py-2 shadow-md text-xs'
  },
    h('p', { className: 'font-semibold text-ink-700 mb-1' }, label),
    ...payload.map((p, i) =>
      h('p', { key: i, style: { color: p.color }, className: 'font-medium' },
        `${p.name} : ${p.value}`
      )
    )
  )
}

export default function Dashboard() {
  const [stats, setStats]             = useState(null)
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    api.get('/reservations/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/reservations').then(r => setReservations(r.data.slice(0, 7))).catch(() => {})
  }, [])

  const pieData = stats ? [
    { name: 'Disponibles', value: stats.available },
    { name: 'Occupées',    value: stats.occupied },
    { name: 'Maintenance', value: stats.total - stats.available - stats.occupied },
  ].filter(d => d.value > 0) : []

  const days = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
  const weekData = days.map((day, i) => ({
    day,
    confirmées: Math.floor(Math.random() * 8) + 2,
    annulées:   Math.floor(Math.random() * 3),
  }))

  return h('div', { className: 'space-y-6 animate-in' },

    // Header
    h('div', { className: 'flex items-start justify-between' },
      h('div', null,
        h('h1', { className: 'text-2xl font-bold text-ink-900' }, 'Tableau de bord'),
        h('p', { className: 'text-sm text-ink-300 mt-0.5' },
          new Date().toLocaleDateString('fr-MA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        )
      ),
      h('div', {
        className: 'flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full'
      },
        h('span', { className: 'w-1.5 h-1.5 bg-green-500 rounded-full inline-block' }),
        'Système en ligne'
      )
    ),

    // Stat cards
    h('div', { className: 'grid grid-cols-2 lg:grid-cols-4 gap-4' },
      h(StatCard, { icon: '🅿',  label: 'Places totales',    value: stats?.total     ?? '—', color: 'blue',   delay: 'delay-1' }),
      h(StatCard, { icon: '✓',   label: 'Disponibles',       value: stats?.available ?? '—', color: 'green',  delay: 'delay-2' }),
      h(StatCard, { icon: '⊠',   label: 'Occupées',          value: stats?.occupied  ?? '—', color: 'orange', delay: 'delay-3' }),
      h(StatCard, { icon: '◷',   label: "Aujourd'hui",       value: stats?.today     ?? '—', color: 'violet', delay: 'delay-4' })
    ),

    // Charts
    h('div', { className: 'grid grid-cols-1 lg:grid-cols-3 gap-4' },

      // Area chart
      h('div', { className: 'card p-5 lg:col-span-2 animate-in delay-2' },
        h('div', { className: 'flex items-center justify-between mb-5' },
          h('div', null,
            h('h2', { className: 'text-sm font-bold text-ink-900' }, 'Activité hebdomadaire'),
            h('p', { className: 'text-xs text-ink-300 mt-0.5' }, 'Réservations des 7 derniers jours')
          ),
          h('div', { className: 'flex items-center gap-3 text-xs text-ink-300' },
            h('span', { className: 'flex items-center gap-1' },
              h('span', { className: 'w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block' }), 'Confirmées'
            ),
            h('span', { className: 'flex items-center gap-1' },
              h('span', { className: 'w-2.5 h-2.5 rounded-sm bg-orange-400 inline-block' }), 'Annulées'
            )
          )
        ),
        h(ResponsiveContainer, { width: '100%', height: 190 },
          h(AreaChart, { data: weekData, margin: { left: -10 } },
            h('defs', null,
              h('linearGradient', { id: 'gBlue', x1: '0', y1: '0', x2: '0', y2: '1' },
                h('stop', { offset: '5%',  stopColor: '#3b82f6', stopOpacity: 0.15 }),
                h('stop', { offset: '95%', stopColor: '#3b82f6', stopOpacity: 0 })
              ),
              h('linearGradient', { id: 'gOrange', x1: '0', y1: '0', x2: '0', y2: '1' },
                h('stop', { offset: '5%',  stopColor: '#f97316', stopOpacity: 0.12 }),
                h('stop', { offset: '95%', stopColor: '#f97316', stopOpacity: 0 })
              )
            ),
            h(XAxis, { dataKey: 'day', tick: { fill: '#a0aab8', fontSize: 11 }, axisLine: false, tickLine: false }),
            h(YAxis, { tick: { fill: '#a0aab8', fontSize: 11 }, axisLine: false, tickLine: false }),
            h(Tooltip, { content: h(CustomTooltip) }),
            h(Area, { type: 'monotone', dataKey: 'confirmées', stroke: '#3b82f6', fill: 'url(#gBlue)',   strokeWidth: 2, dot: false }),
            h(Area, { type: 'monotone', dataKey: 'annulées',   stroke: '#f97316', fill: 'url(#gOrange)', strokeWidth: 2, dot: false })
          )
        )
      ),

      // Pie chart
      h('div', { className: 'card p-5 animate-in delay-3 flex flex-col' },
        h('h2', { className: 'text-sm font-bold text-ink-900 mb-1' }, 'Occupation'),
        h('p', { className: 'text-xs text-ink-300 mb-4' }, 'Répartition des places'),
        h('div', { className: 'flex-1 flex items-center justify-center' },
          h(ResponsiveContainer, { width: '100%', height: 160 },
            h(PieChart, null,
              h(Pie, {
                data: pieData, cx: '50%', cy: '50%',
                innerRadius: 48, outerRadius: 68,
                paddingAngle: 3, dataKey: 'value',
                strokeWidth: 0
              },
                ...pieData.map((_, i) => h(Cell, { key: i, fill: PIE_COLORS[i] }))
              ),
              h(Tooltip, { content: h(CustomTooltip) })
            )
          )
        ),
        h('div', { className: 'space-y-2 mt-2' },
          ...pieData.map((entry, i) =>
            h('div', { key: i, className: 'flex items-center justify-between text-xs' },
              h('div', { className: 'flex items-center gap-2 text-ink-500' },
                h('span', { className: 'w-2.5 h-2.5 rounded-full flex-shrink-0', style: { background: PIE_COLORS[i] } }),
                entry.name
              ),
              h('span', { className: 'font-semibold text-ink-900' }, entry.value)
            )
          )
        )
      )
    ),

    // Recent table
    h('div', { className: 'card animate-in delay-4' },
      h('div', { className: 'flex items-center justify-between px-5 py-4 border-b border-border' },
        h('h2', { className: 'text-sm font-bold text-ink-900' }, 'Réservations récentes'),
        h('span', { className: 'text-xs text-ink-300' }, `${reservations.length} entrées`)
      ),
      h('div', { className: 'overflow-x-auto' },
        h('table', { className: 'w-full text-sm' },
          h('thead', null,
            h('tr', { className: 'bg-bg' },
              ...['Utilisateur','Plaque','Place','Zone','Début','Statut'].map(col =>
                h('th', { key: col, className: 'text-left px-5 py-3 text-xs font-semibold text-ink-300 uppercase tracking-wider' }, col)
              )
            )
          ),
          h('tbody', { className: 'divide-y divide-border' },
            ...reservations.map(r =>
              h('tr', { key: r.id, className: 'hover:bg-blue-50/30 transition-colors' },
                h('td', { className: 'px-5 py-3.5 font-medium text-ink-900 text-sm' }, r.user_name),
                h('td', { className: 'px-5 py-3.5 font-mono text-blue-600 text-xs font-semibold' }, r.plate_number),
                h('td', { className: 'px-5 py-3.5 text-ink-700' }, r.slot_code),
                h('td', { className: 'px-5 py-3.5' },
                  h('span', {
                    className: 'text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md'
                  }, r.zone)
                ),
                h('td', { className: 'px-5 py-3.5 text-ink-300 text-xs' },
                  new Date(r.start_time).toLocaleString('fr-MA', { dateStyle: 'short', timeStyle: 'short' })
                ),
                h('td', { className: 'px-5 py-3.5' },
                  h('span', { className: `badge badge-${r.status}` }, r.status)
                )
              )
            )
          )
        ),
        !reservations.length && h('div', { className: 'text-center py-12 text-ink-300 text-sm' },
          h('p', { className: 'text-2xl mb-2' }, '📭'),
          'Aucune réservation pour le moment'
        )
      )
    )
  )
}