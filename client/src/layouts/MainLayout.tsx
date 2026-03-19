import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, MessageSquare, Users, Settings, Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import NotificationsPanel from '../components/NotificationsPanel'

const TopBar: React.FC<{ onToggleNotify: () => void }> = ({ onToggleNotify }) => {
  const { user } = useStore();
  const location = useLocation();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return `${getGreeting()}, ${user?.business_name || 'Vendor'} 👋`;
      case '/pipeline': return 'Pipeline';
      case '/ai': return 'Sabi AI';
      case '/contacts': return 'Contacts';
      case '/settings': return 'Settings';
      case '/reminders': return 'Reminders';
      case '/analytics': return 'Analytics';
      case '/pricing': return 'Pricing';
      default: return 'Sabi';
    }
  }

  return (
    <div className="sticky top-0 z-40 w-full glass px-4 py-4 flex justify-between items-center h-16">
      <h1 className="text-xl font-syne font-extrabold text-white truncate max-w-[200px]">
        {getPageTitle()}
      </h1>
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleNotify}
          className="relative p-2 rounded-full hover:bg-surface-2 transition-colors active:scale-95"
        >
          <Bell className="w-6 h-6 text-text-muted" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-hot rounded-full"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary font-bold text-xs border border-white/5">
          {user?.business_name?.[0]?.toUpperCase() || 'V'}
        </div>
      </div>
    </div>
  )
}

const BottomNav: React.FC = () => {
  const navItems = [
    { icon: <Home />, label: 'Home', path: '/dashboard' },
    { icon: <LayoutGrid />, label: 'Pipeline', path: '/pipeline' },
    { icon: <MessageSquare />, label: 'Sabi AI', path: '/ai' },
    { icon: <Users />, label: 'Contacts', path: '/contacts' },
    { icon: <Settings />, label: 'Settings', path: '/settings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass safe-p-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 w-full relative transition-colors ${
                isActive ? 'text-accent' : 'text-text-muted hover:text-text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 24 })}
                  {isActive && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full"
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export const MainLayout: React.FC = () => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false)

  return (
    <div className="min-h-screen pb-20">
      <TopBar onToggleNotify={() => setIsNotifyOpen(true)} />
      <main className="p-4">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
      <BottomNav />
      <NotificationsPanel isOpen={isNotifyOpen} onClose={() => setIsNotifyOpen(false)} />
    </div>
  )
}
