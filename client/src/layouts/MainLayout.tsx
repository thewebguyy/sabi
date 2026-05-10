import React, { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutGrid, TrendingUp, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'

const TopBar: React.FC = () => {
  const { user } = useStore()
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/deals': return user?.business_name || 'Sabi CRM'
      case '/revenue': return 'Revenue'
      case '/settings': return 'Settings'
      default:
        if (location.pathname.startsWith('/deals/')) return 'Deal Details'
        return 'Sabi'
    }
  }

  return (
    <div className="sticky top-0 z-40 w-full glass px-4 py-4 flex justify-between items-center h-16">
      <h1 className="text-xl font-syne font-extrabold text-white truncate max-w-[70%]">
        {getPageTitle()}
      </h1>
      <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-extrabold text-sm">
        {user?.business_name?.[0]?.toUpperCase() || 'S'}
      </div>
    </div>
  )
}

const BottomNav: React.FC = () => {
  const navItems = [
    { icon: <LayoutGrid />, label: 'Deals', path: '/deals' },
    { icon: <TrendingUp />, label: 'Revenue', path: '/revenue' },
    { icon: <Settings />, label: 'Settings', path: '/settings' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass safe-p-bottom border-t border-white/5">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 flex-1 py-2 relative transition-colors ${
                isActive ? 'text-accent' : 'text-text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 22 })}
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full"
                    />
                  )}
                </div>
                <span className="text-[10px] font-bold">{item.label}</span>
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
    <div className="min-h-screen pb-20">
      <TopBar />
      <main className="p-4">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
      <BottomNav />
    </div>
  )
}
