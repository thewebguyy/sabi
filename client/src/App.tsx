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
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#FFB020] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />

  return children
}

function App() {
  const { initialize } = useStore()

  useEffect(() => {
    initialize()
  }, [])

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
              <Route path="/capture" element={<div className="min-h-screen bg-[#0A0A0A] text-[#F3F2EF] p-4 max-w-md mx-auto"><Capture /></div>} />
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
