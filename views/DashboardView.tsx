
import React, { useEffect, useState } from 'react';
import { 
  Users, 
  MousePointer2, 
  Send, 
  Globe, 
  MapPin, 
  TrendingUp, 
  BarChart3, 
  Zap, 
  Activity, 
  ChevronDown,
  Layout,
  MousePointerClick,
  Target,
  Trophy
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { FCMService } from '../services/fcmService';
import { Stats, AppInstance } from '../types';

const DashboardView: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [apps, setApps] = useState<AppInstance[]>([]);
  const [selectedApp, setSelectedApp] = useState<string>('');
  const service = FCMService.getInstance();

  useEffect(() => {
    service.getApps().then(list => {
      setApps(list);
      if (list.length > 0) setSelectedApp(list[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedApp) service.getStats(selectedApp).then(setStats);
  }, [selectedApp]);

  if (!stats) return <div className="animate-pulse flex items-center justify-center h-[60vh] text-blue-600 font-black">جاري مزامنة بيانات Edge...</div>;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">لوحة القيادة الموحدة</h1>
          <p className="text-slate-500 font-bold mt-2">مراقبة البنية التحتية للإشعارات في الوقت الفعلي.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 mr-2 uppercase">تصفية حسب المشروع</span>
            <select 
              value={selectedApp} 
              onChange={(e) => setSelectedApp(e.target.value)}
              className="appearance-none bg-slate-50 px-4 py-2 rounded-xl font-black text-xs text-slate-700 focus:outline-none focus:ring-2 ring-blue-500/20 border border-slate-200"
            >
              {apps.map(app => <option key={app.id} value={app.id}>{app.name}</option>)}
            </select>
          </div>
          <button className="bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black text-xs shadow-xl shadow-slate-900/20 hover:scale-105 transition-all">تصدير التقارير (PDF)</button>
        </div>
      </div>

      {/* High-Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي الجمهور', val: stats.totalSubscribers, icon: <Users />, trend: '+12.5%', color: 'blue' },
          { label: 'المتفاعلون (24h)', val: stats.activeLast24h, icon: <Zap />, trend: '+4.2%', color: 'emerald' },
          { label: 'معدل النقر (CTR)', val: `${stats.avgClickRate}%`, icon: <MousePointerClick />, trend: '+0.8%', color: 'amber' },
          { label: 'معدل التحويل', val: `${stats.conversionRate}%`, icon: <Trophy />, trend: '+2.1%', color: 'indigo' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="relative">
              <div className={`p-3 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-xl w-fit mb-4`}>{kpi.icon}</div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{typeof kpi.val === 'number' ? kpi.val.toLocaleString() : kpi.val}</h3>
              <div className="flex items-center gap-1.5 mt-4">
                 <span className={`text-xs font-black ${kpi.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{kpi.trend}</span>
                 <span className="text-[9px] text-slate-400 font-bold">منذ الأسبوع الماضي</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                <BarChart3 className="text-blue-600" />
                تتبع الأداء اليومي
              </h3>
              <div className="flex gap-2">
                 <button className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black">7 أيام</button>
                 <button className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-400 text-[10px] font-black">30 يوم</button>
              </div>
           </div>
           <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.timeline}>
                  <defs>
                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '20px' }} />
                  <Area type="monotone" dataKey="sent" stroke="#2563eb" strokeWidth={4} fill="url(#colorSent)" />
                  <Area type="monotone" dataKey="clicks" stroke="#8b5cf6" strokeWidth={4} fill="url(#colorClicks)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="space-y-8 flex flex-col">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex-1">
             <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">
                <Globe className="text-emerald-500" size={20} />
                توزيع الأقاليم
             </h3>
             <div className="space-y-6">
                {stats.countryDistribution.map((c, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-black">
                       <span className="text-slate-600">{c.name}</span>
                       <span className="text-blue-600">{c.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.value}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
             <div className="flex items-center gap-2 mb-4">
                <Activity size={18} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase text-slate-400">نظام الذكاء الاصطناعي</span>
             </div>
             <h4 className="text-lg font-black mb-2">توصية الأداء</h4>
             <p className="text-xs text-slate-400 leading-relaxed font-medium">
               لاحظنا تفاعلاً عالياً من مستخدمي الـ Mobile في الإمارات بين الساعة 8-10 مساءً. نوصي بجدولة الحملة القادمة في هذا التوقيت.
             </p>
             <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black transition-all border border-white/10">تطبيق التوصية الآن</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
