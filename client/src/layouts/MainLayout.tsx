import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Clock, Layers, Settings, PlusCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useStore } from '../store/useStore'

const TopBar: React.FC = () => {
  const { user } = useStore()
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/today':
        return user?.business_name || 'Sabi'
      case '/deals':
        return 'All Opportunities'
      case '/settings':
        return 'Settings'
      case '/capture':
        return 'Capture Conversation'
      default:
        if (location.pathname.startsWith('/deals/')) return 'Opportunity Details'
        return 'Sabi'
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#262626] px-4 py-3 flex justify-between items-center h-16">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-[#FFB020]/15 border border-[#FFB020]/30 flex items-center justify-center text-[#FFB020] font-black text-sm">
          S
        </div>
        <h1 className="text-lg font-bold text-[#F3F2EF] truncate max-w-[200px]">
          {getPageTitle()}
        </h1>
      </div>
      
      <NavLink 
        to="/capture" 
        className="flex items-center gap-1.5 bg-[#FFB020] text-[#0A0A0A] font-bold px-3 py-1.5 rounded-xl text-xs active:scale-95 transition-all shadow-[0_0_15px_rgba(255,176,32,0.2)]"
      >
        <PlusCircle size={16} />
        <span>Capture</span>
      </NavLink>
    </header>
  )
}

const BottomNav: React.FC = () => {
  const navItems = [
    { icon: <Clock />, label: 'Today', path: '/today' },
    { icon: <Layers />, label: 'Deals', path: '/deals' },
    { icon: <Settings />, label: 'Settings', path: '/settings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-lg border-t border-[#262626] pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 flex-1 py-2 relative transition-colors ${
                isActive ? 'text-[#FFB020]' : 'text-[#8E8E93]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 22 })}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#FFB020] rounded-full shadow-[0_0_8px_#FFB020]"
                    />
                  )}
                </div>
                <span className="text-[11px] font-medium tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F2EF] pb-20 selection:bg-[#FFB020]/20 selection:text-[#FFB020]">
      <TopBar />
      <main className="p-4 max-w-md mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
