import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Briefcase, Boxes, ShoppingCart, 
  ArrowUpRight, Activity, Plus, BarChart3
} from 'lucide-react';
import api from '../utils/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    projects: 0,
    items: 0,
    users: 0,
    pendingPRs: 0,
    activeWorkflows: 0,
    stockValue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, itemsRes, usersRes, prRes] = await Promise.allSettled([
          api.get('/project/projects'),
          api.get('/inventory/items'),
          api.get('/master/users'),
          api.get('/procurement/pr')
        ]);
        
        setStats({
          projects: projRes.status === 'fulfilled' ? projRes.value.data?.length || 0 : 0,
          items: itemsRes.status === 'fulfilled' ? itemsRes.value.data?.length || 0 : 0,
          users: usersRes.status === 'fulfilled' ? usersRes.value.data?.length || 0 : 0,
          pendingPRs: prRes.status === 'fulfilled' ? (prRes.value.data?.filter((p: any) => p.approvalStatus === 'pending').length || 0) : 0,
          activeWorkflows: 0,
          stockValue: 0
        });

      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, trend }: any) => (
    <div className="bg-white p-6 rounded-[35px] border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative">
      <div className="flex items-start justify-between relative z-10">
        <div className="p-4 rounded-2xl bg-primary/[0.03] text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${trend > 0 ? 'text-green-500' : 'text-slate-400'}`}>
          {trend > 0 ? <ArrowUpRight size={14} /> : <Activity size={14} />}
          {trend > 0 ? `+${trend}%` : 'Stable'}
        </div>
      </div>
      <div className="mt-6 relative z-10">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-2xl font-black text-black tracking-tight">
            {typeof value === 'number' && value > 1000 ? `${(value/1000).toFixed(1)}k` : value}
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity className="animate-spin text-primary/20" size={40} />
          <p className="text-[10px] font-black text-primary/20 uppercase tracking-[0.4em]">Optimizing Engine</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-8 animate-fade-in pb-8 overflow-y-auto no-scrollbar">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-xl font-black text-black tracking-tighter uppercase italic">SK8 Intelligence Hub</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Enterprise Performance Monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Operational</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Projects" value={stats.projects} icon={<Briefcase size={22} />} trend={0} />
        <StatCard title="Inventory SKUs" value={stats.items} icon={<Boxes size={22} />} trend={0} />
        <StatCard title="Requisitions" value={stats.pendingPRs} icon={<ShoppingCart size={22} />} trend={0} />
        <StatCard title="Team Strength" value={stats.users} icon={<Users size={22} />} trend={0} />
      </div>

      {/* Analytics & Activity Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1 min-h-[400px]">
        
        {/* Project Health Chart Placeholder */}
        <div className="xl:col-span-2 bg-white rounded-[45px] border border-primary/5 shadow-sm p-10 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 text-slate-50 group-hover:text-primary/5 transition-colors">
             <BarChart3 size={200} strokeWidth={1} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-slate-50 rounded-2xl text-black">
                <TrendingUp size={20} />
              </div>
              <div>
                 <h2 className="text-xs font-black text-black uppercase tracking-[0.2em]">Live Operation Pulse</h2>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 italic">Real-time Project Execution Data</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
               {[
                 { label: 'Procurement Cycle', value: '4.2 Days', color: 'text-green-500' },
                 { label: 'Project Variance', value: '-2.5%', color: 'text-primary' },
                 { label: 'Stock Accuracy', value: '99.8%', color: 'text-green-500' }
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{item.label}</p>
                    <p className={`text-xl font-black ${item.color} tracking-tighter`}>{item.value}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Action Hub */}
        <div className="bg-primary p-10 rounded-[45px] shadow-2xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-32 -mt-32 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="relative z-10">
            <h2 className="text-white text-[11px] font-black uppercase tracking-[0.3em] italic">Strategic Hub</h2>
            <p className="text-white/40 text-[8px] font-bold uppercase mt-1 tracking-widest">Execute Priority Decisions</p>
            
            <div className="mt-12 space-y-4">
              {[
                { label: 'New Requisition', sub: 'Project Material Request' },
                { label: 'Dispatch Order', sub: 'Site Logistics' }
              ].map((act, i) => (
                <button key={i} className="w-full p-6 bg-white/5 border border-white/10 rounded-[30px] flex items-center justify-between group/btn hover:bg-white hover:text-primary transition-all duration-500">
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest">{act.label}</p>
                    <p className="text-[7px] font-bold opacity-40 uppercase mt-0.5 tracking-[0.2em]">{act.sub}</p>
                  </div>
                  <Plus size={16} className="opacity-40 group-hover/btn:rotate-90 group-hover/btn:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-white/10 relative z-10">
            <div className="flex items-center justify-between text-white/60">
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">System Health Index</span>
              <span className="text-2xl font-black text-white italic tracking-tighter">99.9%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-white w-[99.9%] rounded-full shadow-[0_0_20px_rgba(255,255,255,0.6)]" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
