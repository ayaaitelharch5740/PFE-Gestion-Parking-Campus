import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.js'
import ProtectedRoute from './components/ProtectedRoute.js'
import Navbar from './components/Navbar.js'
import Login from './pages/Login.js'
import Dashboard from './pages/Dashboard.js'
import Slots from './pages/Slots.js'
import Reservations from './pages/Reservations.js'
import Users from './pages/Users.js'
const h = React.createElement

function Layout({ children }) {
  return h('div', { className: 'flex min-h-screen bg-bg' },
    h(Navbar),
    h('main', { className: 'ml-60 flex-1 p-8', style: { maxWidth: 'calc(100vw - 240px)' } },
      children
    )
  )
}

function AppRoutes() {
  const { user } = useAuth()
  return h(Routes, null,
    h(Route, { path: '/login',
      element: user ? h(Navigate, { to: '/', replace: true }) : h(Login) }),
    h(Route, { path: '/',
      element: h(ProtectedRoute, null, h(Layout, null, h(Dashboard))) }),
    h(Route, { path: '/slots',
      element: h(ProtectedRoute, null, h(Layout, null, h(Slots))) }),
    h(Route, { path: '/reservations',
      element: h(ProtectedRoute, { roles: ['admin','agent'] }, h(Layout, null, h(Reservations))) }),
    h(Route, { path: '/users',
      element: h(ProtectedRoute, { roles: ['admin'] }, h(Layout, null, h(Users))) }),
    h(Route, { path: '*', element: h(Navigate, { to: '/', replace: true }) })
  )
}

export default function App() {
  return h(AuthProvider, null,
    h(BrowserRouter, null, h(AppRoutes))
  )
}