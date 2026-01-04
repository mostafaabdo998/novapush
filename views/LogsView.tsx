
import React, { useEffect, useState } from 'react';
import { Activity, Terminal, ShieldAlert, CheckCircle2, AlertTriangle, Clock, RefreshCcw } from 'lucide-react';
import { FCMService } from '../services/fcmService';
import { SystemLog } from '../types';

const LogsView: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const service = FCMService.getInstance();

  useEffect(() => {
    service.getLogs().then(setLogs);
  }, []);

  const getLevelStyle = (level: string) => {
    switch(level) {
      case 'error': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'warning': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'error': return <ShieldAlert size={14} />;
      case 'warning': return <AlertTriangle size={14} />;
      default: return <CheckCircle2 size={14} />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">سجلات النظام الحية</h1>
          <p className="text-slate-500 font-bold mt-1">مراقبة استجابات FCM و APNs وتدفق البيانات عبر API.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all">
          <RefreshCcw size={14} />
          تحديث السجلات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 p-6 rounded-[2rem] text-white lg:col-span-1">
           <div className="flex items-center gap-2 mb-6">
              <Terminal size={18} className="text-blue-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Health Status</span>
           </div>
           <div className="space-y-6">
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-400">FCM Gateway</span>
                 <span className="text-xs font-black text-emerald-400">Stable</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-400">APNs Tunnel</span>
                 <span className="text-xs font-black text-emerald-400">Active</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-slate-400">DB Latency</span>
                 <span className="text-xs font-black text-blue-400">14ms</span>
              </div>
           </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                 <thead className="bg-slate-50">
                    <tr>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">المستوى</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">الخدمة</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">الرسالة</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">الوقت</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5">
                           <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border ${getLevelStyle(log.level)}`}>
                              {getLevelIcon(log.level)}
                              {log.level.toUpperCase()}
                           </span>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-xs font-black text-slate-900">{log.service}</span>
                        </td>
                        <td className="px-8 py-5">
                           <p className="text-xs font-bold text-slate-600">{log.message}</p>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                              <Clock size={12} />
                              {new Date(log.timestamp).toLocaleTimeString()}
                           </div>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LogsView;
