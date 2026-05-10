import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import { MainLayout } from './layouts/MainLayout'

import Auth from './pages/Auth'
import Deals from './pages/Deals'
import DealDetail from './pages/DealDetail'
import Revenue from './pages/Revenue'
import Settings from './pages/Settings'

import { ToastProvider } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading, initialized } = useStore()

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
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
            <Route path="/" element={<Navigate to="/deals" replace />} />

            {/* Protected — with bottom nav layout */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/deals" element={<Deals />} />
              <Route path="/deals/:id" element={<DealDetail />} />
              <Route path="/revenue" element={<Revenue />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/deals" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App
