
import React, { useEffect, useState } from 'react';
import { Users, MousePointer2, Send, Globe, MapPin, TrendingUp, BarChart3, Database, Zap, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import { LaraPushService } from '../services/laraPushService';
import { Stats } from '../types';

const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const service = LaraPushService.getInstance();

  useEffect(() => {
    service.getStats('shoes-store.com').then(setStats);
  }, []);

  if (!stats) return (
    <div className="flex flex-col items-center justify-center h-[50vh]">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold">جاري المزامنة مع قاعدة lp_db...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">نظرة عامة</h1>
          <div className="flex items-center gap-3 mt-2">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[11px] font-bold border border-emerald-100">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               قاعدة البيانات: متصلة (lp_db)
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold border border-blue-100">
               <Zap size={12} fill="currentColor" />
               محرك الإرسال: LaraPush API
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
             <Globe size={18} className="text-slate-400" />
             <span className="text-sm font-bold text-slate-700">shoes-store.com</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي المشتركين" value={stats.totalSubscribers.toLocaleString()} trend={stats.growth} icon={<Users size={24} />} />
        <StatCard title="الحملات المرسلة" value="1" icon={<Send size={24} />} />
        <StatCard title="نقرات الإشعارات" value="1,120" trend={14.2} icon={<MousePointer2 size={24} />} />
        <StatCard title="نسبة النقر (CTR)" value="13.3%" trend={2.1} icon={<BarChart3 size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <TrendingUp size={24} className="text-blue-600" />
            نمو المشتركين اليومي
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyActive}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#2563eb', fontWeight: '800' }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <MapPin size={24} className="text-blue-600" />
            التوزيع الجغرافي النشط
          </h3>
          <div className="space-y-6">
            {stats.countries.map((country, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 font-bold">{country.name}</span>
                  <span className="text-blue-600 font-black">{((country.value / stats.totalSubscribers) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(country.value / stats.totalSubscribers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-5 bg-slate-900 rounded-2xl text-white">
             <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-xs">
                <Activity size={14} />
                <span>حالة المزامنة</span>
             </div>
             <p className="text-[10px] text-slate-400 font-mono">
               SQL: SELECT * FROM subscribers WHERE domain = 'shoes-store.com'
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
