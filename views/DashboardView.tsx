
import React, { useEffect, useState } from 'react';
import { Users, MousePointer2, Send, Globe, MapPin, TrendingUp, BarChart3, Zap, Activity, ChevronDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';
import { LaraPushService } from '../services/laraPushService';
import { Stats, Domain } from '../types';

const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const service = LaraPushService.getInstance();

  useEffect(() => {
    service.getDomains().then(list => {
      setDomains(list);
      if (list.length > 0) setSelectedTag(list[0].url);
    });
  }, []);

  useEffect(() => {
    if (selectedTag) {
      service.getStats(selectedTag).then(setStats);
    }
  }, [selectedTag]);

  if (!stats) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">إحصائيات المتاجر</h1>
          <p className="text-slate-500 font-medium mt-1">مراقبة نمو المشتركين والتفاعل لكل متجر على حدة.</p>
        </div>
        
        <div className="relative group">
          <select 
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="appearance-none bg-white px-10 py-3.5 rounded-2xl border-2 border-slate-100 font-black text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer shadow-sm min-w-[200px]"
          >
            {domains.map(d => (
              <option key={d.id} value={d.url}>{d.url}</option>
            ))}
          </select>
          <Globe size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600" />
          <ChevronDown size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي المشتركين" value={(stats.totalSubscribers ?? 0).toLocaleString()} trend={stats.growth ?? 0} icon={<Users size={24} />} />
        <StatCard title="إجمالي الحملات" value="12" icon={<Send size={24} />} />
        <StatCard title="متوسط النقرات" value="8.4%" trend={1.2} icon={<MousePointer2 size={24} />} />
        <StatCard title="الحالة التقنية" value="متصل" icon={<Activity size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <TrendingUp size={24} className="text-blue-600" />
            نمو المشتركين (آخر 7 أيام)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyActive ?? []}>
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

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <MapPin size={24} className="text-blue-600" />
            توزيع الأجهزة
          </h3>
          <div className="space-y-8 flex-1">
            {(stats.devices ?? []).map((device, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-700 font-bold">{device.name}</span>
                  <span className="text-blue-600 font-black">{device.value}%</span>
                </div>
                <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${device.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-5 bg-slate-900 rounded-2xl">
             <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-xs">
                <Zap size={14} />
                <span>اتصال الجسر النشط</span>
             </div>
             <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
               ENDPOINT: /api_bridge.php<br/>
               CLIENT_ID: {selectedTag}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
