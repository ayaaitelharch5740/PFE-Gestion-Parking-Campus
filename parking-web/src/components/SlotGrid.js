import React from 'react'
const h = React.createElement

const statusCls = {
  available:   'bg-green-50 border-green-200 text-green-700 hover:border-green-400',
  occupied:    'bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-400',
  maintenance: 'bg-orange-50 border-orange-200 text-orange-700 hover:border-orange-300',
}

const legendItems = [
  { status: 'available',   label: 'Disponible' },
  { status: 'occupied',    label: 'Occupée' },
  { status: 'maintenance', label: 'Maintenance' },
]

export default function SlotGrid({ slots, onToggleMaintenance }) {
  const zones = ['A','B','C']

  return h('div', { className: 'space-y-6' },

    // Legend
    h('div', { className: 'flex gap-4 flex-wrap' },
      ...legendItems.map(l =>
        h('div', { key: l.status, className: 'flex items-center gap-1.5 text-xs text-ink-500' },
          h('span', { className: `w-3 h-3 rounded border ${statusCls[l.status].split(' ').slice(0,2).join(' ')}` }),
          l.label
        )
      )
    ),

    ...zones.map(zone => {
      const zoneSlots = slots.filter(s => s.zone === zone)
      if (!zoneSlots.length) return null
      return h('div', { key: zone },
        h('div', { className: 'flex items-center gap-2 mb-3' },
          h('span', {
            className: 'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white',
            style: { background: '#2563eb' }
          }, zone),
          h('span', { className: 'text-sm font-semibold text-ink-700' }, `Zone ${zone}`),
          h('span', { className: 'text-xs text-ink-300' }, `— ${zoneSlots.length} places`)
        ),
        h('div', { className: 'grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-2' },
          ...zoneSlots.map(slot =>
            h('button', {
              key: slot.id,
              onClick: () => onToggleMaintenance(slot),
              title: `${slot.slot_code} · ${slot.status} · Cliquer pour maintenance`,
              className: `border rounded-lg py-2 px-1 text-center text-xs font-semibold transition-all hover:scale-105 hover:shadow-sm ${statusCls[slot.status]}`
            }, slot.slot_code)
          )
        )
      )
    }).filter(Boolean)
  )
}