import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'

import { useAuthStore } from '@/store'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
