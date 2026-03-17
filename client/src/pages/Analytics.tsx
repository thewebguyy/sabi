import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Target, Ghost, ShieldCheck, Calendar, ChevronDown } from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie 
} from 'recharts'

const AnalyticsCard = ({ icon, label, value, trend, trendColor }: any) => (
  <div className="bg-surface p-5 rounded-3xl border border-white/5 space-y-4 shadow-xl">
    <div className="flex justify-between items-start">
      <div className="w-10 h-10 rounded-2xl bg-surface-2 flex items-center justify-center text-accent/80 border border-white/5">
        {icon}
      </div>
      {trend && (
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/5 ${trendColor}`}>
          {trend}
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-mono font-bold text-text-primary">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">{label}</div>
    </div>
  </div>
)

const Analytics: React.FC = () => {
  const revenueData = [
    { week: 'W1', amount: 120000 },
    { week: 'W2', amount: 250000 },
    { week: 'W3', amount: 180000 },
    { week: 'W4', amount: 480000 },
    { week: 'W5', amount: 320000 },
    { week: 'W6', amount: 640000 },
    { week: 'W7', amount: 420000 },
    { week: 'W8', amount: 890000 },
  ]

  const statusData = [
    { name: 'Inquiry', value: 45, color: '#facc15' },
    { name: 'Pending', value: 30, color: '#25D366' },
    { name: 'Paid', value: 15, color: '#4CAF50' },
    { name: 'Ghosted', value: 10, color: '#FF6B35' },
  ]

  const topCustomers = [
    { name: 'Chidinma O.', amount: 450000 },
    { name: 'Kunle A.', amount: 320000 },
    { name: 'Blessing F.', amount: 280000 },
    { name: 'Emeka T.', amount: 210000 },
    { name: 'Musa D.', amount: 180000 },
  ]

  return (
    <div className="pb-24 pt-4">
      {/* Date Selector */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-syne font-extrabold">Analytics</h2>
        <button className="bg-surface-2 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 text-text-primary active:scale-95 transition-all">
          <Calendar size={14} /> This Month <ChevronDown size={14} />
        </button>
      </div>

      {/* Grid Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <AnalyticsCard icon={<TrendingUp size={20} />} label="Total Deals" value="84" trend="+12%" trendColor="text-accent" />
        <AnalyticsCard icon={<ShieldCheck size={20} />} label="Closed" value="38" trend="+5%" trendColor="text-accent" />
        <AnalyticsCard icon={<DollarSign size={20} />} label="Revenue" value="₦2.4M" trend="+18%" trendColor="text-accent" />
        <AnalyticsCard icon={<Ghost size={20} />} label="Ghosted" value="12" trend="-2%" trendColor="text-hot" />
      </div>

      {/* Sabi Recovered Highlight */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-primary/40 border border-accent/20 p-6 rounded-[32px] mb-10 overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
           <ShieldCheck size={120} className="text-accent" />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-syne font-extrabold text-accent mb-4 flex items-center gap-2">
             <ShieldCheck size={24} /> Sabi Recovered
          </h3>
          <p className="text-lg font-medium leading-relaxed mb-4">
             "This month, Sabi reminded you about 14 leads. You followed up on 9. That's ₦340,000 you almost lost. 💚"
          </p>
          <div className="flex gap-4">
             <div className="flex-1 bg-white/5 rounded-2xl p-4">
                <div className="text-xs text-text-muted font-bold uppercase mb-1">Followed Up</div>
                <div className="text-2xl font-mono font-bold">9 / 14</div>
             </div>
             <div className="flex-1 bg-white/5 rounded-2xl p-4">
                <div className="text-xs text-text-muted font-bold uppercase mb-1">Recovery Rate</div>
                <div className="text-2xl font-mono font-bold">64%</div>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Revenue Chart */}
      <div className="bg-surface p-6 rounded-[32px] border border-white/5 mb-8">
         <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-8">Weekly Revenue (NGN)</h3>
         <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                <XAxis dataKey="week" stroke="#7A7A7A" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161616', borderRadius: '16px', border: '1px solid #ffffff10', color: '#F0F0F0' }} 
                  labelStyle={{ fontSize: '10px', color: '#7A7A7A' }}
                />
                <Line type="monotone" dataKey="amount" stroke="#25D366" strokeWidth={4} dot={{ fill: '#25D366', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Deals by Status */}
      <div className="bg-surface p-6 rounded-[32px] border border-white/5 mb-8">
         <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-8">Deals by Status</h3>
         <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
               <BarChart data={statusData}>
                  <XAxis dataKey="name" stroke="#7A7A7A" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: '#161616', borderRadius: '16px', border: '1px solid #ffffff10' }} 
                  />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Top Customers */}
      <div className="bg-surface p-6 rounded-[32px] border border-white/5">
         <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-8">Top Customers</h3>
         <div className="space-y-6">
            {topCustomers.map((c, i) => (
               <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center font-bold text-xs">
                        {c.name.split(' ')[0][0]}{c.name.split(' ')[1][0]}
                     </div>
                     <span className="text-sm font-bold">{c.name}</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-accent">₦{c.amount.toLocaleString()}</div>
               </div>
            ))}
         </div>
      </div>
    </div>
  )
}

export default Analytics
