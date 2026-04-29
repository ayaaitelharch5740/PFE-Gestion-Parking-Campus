import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.js'

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return React.createElement(Navigate, { to: '/login', replace: true })
  if (roles && !roles.includes(user.role)) return React.createElement(Navigate, { to: '/', replace: true })
  return children
}