import React, { useState } from 'react'
import { Building, LogOut, Shield, Trash2, Check } from 'lucide-react'
import { useStore } from '../store/useStore'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'

export const Settings: React.FC = () => {
  const { user, updateProfile, signOut } = useStore()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [businessName, setBusinessName] = useState(user?.business_name || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessName.trim()) return
    setSaving(true)
    try {
      await updateProfile({ business_name: businessName.trim() })
      toast('Profile updated!', 'success')
    } catch {
      toast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast('Signed out successfully', 'success')
    navigate('/auth')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold text-[#F3F2EF]">Settings</h2>
        <p className="text-xs text-[#8E8E93]">Manage your business profile and data options.</p>
      </div>

      {/* Business Profile */}
      <form onSubmit={handleSave} className="bg-[#141414] border border-[#262626] rounded-3xl p-5 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">Business Profile</h3>
        
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider ml-1">
            Business Name
          </label>
          <div className="relative">
            <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl py-3 pl-10 pr-3.5 text-xs text-[#F3F2EF] outline-none focus:border-[#FFB020]/50"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider ml-1">
            Currency
          </label>
          <input
            readOnly
            type="text"
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl py-3 px-3.5 text-xs text-[#8E8E93] outline-none cursor-not-allowed font-mono"
            value="NGN (₦) - Nigerian Naira"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#FFB020] text-[#0A0A0A] font-extrabold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Data Privacy Info */}
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-[#10B981]">
          <Shield size={18} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F3F2EF]">Data Minimization</h3>
        </div>
        <p className="text-xs text-[#8E8E93] leading-relaxed">
          Sabi does not store raw WhatsApp chat logs in database persistence. Chat snippets are processed transiently to extract deal metadata and immediately discarded.
        </p>
      </div>

      {/* Account Actions */}
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-5 space-y-3">
        <button
          onClick={handleSignOut}
          className="w-full bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#EF4444]/20 transition-all"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default Settings
