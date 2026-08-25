import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useStore } from './store/useStore'
import { MainLayout } from './layouts/MainLayout'

import Auth from './pages/Auth'
import Today from './pages/Today'
import Deals from './pages/Deals'
import Settings from './pages/Settings'
import Capture from './pages/Capture'

import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading, initialized } = useStore()

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-3 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-text-muted text-xs">Loading Sabi…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />

  return children
}

function App() {
  const { initialize, initialized, loading } = useStore()

  useEffect(() => {
    initialize()
  }, [])

  // Safety valve: if initialization hangs for 8s (stale token, unreachable Supabase),
  // clear persisted state and let the user re-auth.
  useEffect(() => {
    if (initialized || !loading) return

    const timeout = setTimeout(() => {
      const state = useStore.getState()
      if (!state.initialized || state.loading) {
        console.warn('[Sabi] Initialization timed out — clearing stale session.')
        useStore.setState({ user: null, token: null, initialized: true, loading: false })
      }
    }, 8000)

    return () => clearTimeout(timeout)
  }, [initialized, loading])

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected — with 3-tab bottom nav layout */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/today" element={<Today />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Protected — full screen modal/action routes */}
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="/capture" element={<div className="min-h-screen bg-background text-text-primary p-4 max-w-md mx-auto"><Capture /></div>} />
            </Route>

            {/* Default / Fallbacks */}
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="*" element={<Navigate to="/today" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
