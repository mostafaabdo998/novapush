
import React, { useEffect, useState } from 'react';
import { Users, MousePointer2, Send, Globe, MapPin, TrendingUp, BarChart3, Database, ShieldCheck, Activity } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold animate-pulse">جاري الاتصال بقاعدة بيانات lp_db...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">نظرة عامة على الأداء</h1>
          <div className="flex items-center gap-3 mt-1">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold border border-emerald-100 shadow-sm">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
               قاعدة البيانات: lp_db (متصلة)
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[11px] font-bold border border-blue-100 shadow-sm">
               <Activity size={12} />
               المحرك: LaraPush Engine v2.5
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-3 shadow-sm">
            <Globe size={20} className="text-slate-400" />
            <select className="bg-transparent border-none text-sm font-bold focus:outline-none">
              <option>shoes-store.com</option>
              <option>tech-blog.ar</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="المشتركين النشطين" value={stats.totalSubscribers.toLocaleString()} trend={stats.growth} icon={<Users size={24} />} />
        <StatCard title="حملات هذا الشهر" value="12" icon={<Send size={24} />} />
        <StatCard title="نقرات الإشعارات" value="4,102" trend={12.5} icon={<MousePointer2 size={24} />} />
        <StatCard title="متوسط الـ CTR" value="11.2%" trend={0.5} icon={<BarChart3 size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp size={20} className="text-blue-600" />
              معدل نمو المشتركين (Live)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">Source: MySQL lp_db.subscribers</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyActive}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            التوزيع الجغرافي (SQL Filter)
          </h3>
          <div className="space-y-5">
            {stats.countries.map((country, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-800 font-bold">{country.name}</span>
                  <span className="text-blue-600 font-bold">{((country.value / stats.totalSubscribers) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden border border-slate-100">
                  <div 
                    className="bg-gradient-to-l from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${(country.value / stats.totalSubscribers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
             <div className="flex items-center gap-2 text-[11px] text-blue-600 font-bold mb-3">
                <Database size={14} />
                <span>الاستعلام النشط:</span>
             </div>
             <p className="text-[10px] text-blue-900/70 font-mono leading-relaxed">
               SELECT country, count(*) FROM subscribers <br/>
               WHERE domain = 'shoes-store.com' <br/>
               GROUP BY country ORDER BY count DESC;
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
