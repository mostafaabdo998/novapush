
import React, { useEffect, useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Users, Zap, MousePointerClick, TrendingUp, BarChart3, Globe, 
  Activity, Target, ChevronDown, Sparkles, Plus, CreditCard
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardView: React.FC = () => {
  const { user, apps, campaigns } = useApp();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // محاكاة تحميل الإحصائيات بناءً على بيانات الستور
    const timeline = Array.from({ length: 14 }, (_, i) => ({
      date: `${i + 1} Mar`,
      sent: 8000 + Math.random() * 5000,
      clicks: 1200 + Math.random() * 1000
    }));
    setStats({ timeline });
  }, [campaigns]);

  if (!stats) return null;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-jakarta tracking-tight">مرحباً، {user.name.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 font-medium mt-1">إليك ملخص أداء البنية التحتية لإشعاراتك اليوم.</p>
         </div>
         <div className="flex gap-3">
            <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
               <Activity size={14} />
               تصدير التقارير
            </button>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2">
               <Plus size={14} />
               مشروع جديد
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'إجمالي المشتركين', val: apps.reduce((acc, a) => acc + a.subscribersCount, 0), icon: <Users />, color: 'blue' },
          { label: 'الحملات النشطة', val: campaigns.length, icon: <Zap />, color: 'amber' },
          { label: 'نسبة النقر (CTR)', val: '14.8%', icon: <MousePointerClick />, color: 'emerald' },
          { label: 'الاستهلاك الشهري', val: `${Math.round((user.consumption.messagesSent / user.consumption.limit) * 100)}%`, icon: <CreditCard />, color: 'indigo' },
        ].map((kpi, idx) => (
          <div key={idx} className="glass-card p-6 rounded-2xl group hover:border-blue-200 transition-all">
            <div className={`p-3 bg-${kpi.color}-50 text-${kpi.color}-600 rounded-xl w-fit mb-4`}>{kpi.icon}</div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{typeof kpi.val === 'number' ? kpi.val.toLocaleString() : kpi.val}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
           <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                 <BarChart3 size={18} className="text-blue-600" />
                 تدفق الرسائل (Traffic)
              </h3>
              <select className="bg-slate-50 border-none text-[10px] font-bold text-slate-400 focus:outline-none">
                 <option>آخر 14 يوم</option>
                 <option>آخر 30 يوم</option>
              </select>
           </div>
           <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={stats.timeline}>
                    <defs>
                       <linearGradient id="gradSent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="sent" stroke="#2563eb" strokeWidth={3} fill="url(#gradSent)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="glass-card p-8 rounded-3xl flex flex-col">
           <div className="flex items-center gap-2 mb-6">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="font-bold text-slate-900">أحدث العمليات</h3>
           </div>
           <div className="space-y-6 flex-1">
              {campaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 text-xs font-bold gap-2">
                   <Target size={24} className="opacity-20" />
                   بانتظار إطلاق أول حملة..
                </div>
              ) : (
                campaigns.slice(0, 4).map(c => (
                  <div key={c.id} className="flex gap-4 items-start">
                     <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <Zap size={14} />
                     </div>
                     <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{c.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1">أرسلت إلى {c.stats.sent.toLocaleString()} جهاز</p>
                     </div>
                  </div>
                ))
              )}
           </div>
           <button className="mt-8 w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
              عرض كل الحملات
           </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
