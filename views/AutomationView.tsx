
import React, { useEffect, useState } from 'react';
import { Workflow, Play, Pause, Plus, Clock, Zap, ArrowRight, UserPlus, MousePointerClick, CalendarX } from 'lucide-react';
import { FCMService } from '../services/fcmService';

const AutomationView: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const service = FCMService.getInstance();

  useEffect(() => {
    service.getWorkflows().then(setWorkflows);
  }, []);

  const getIcon = (trigger: string) => {
    switch(trigger) {
      case 'on_subscribe': return <UserPlus className="text-blue-600" />;
      case 'on_click': return <MousePointerClick className="text-emerald-600" />;
      case 'inactivity': return <CalendarX className="text-rose-600" />;
      default: return <Zap />;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900">أتمتة الرحلات</h1>
          <p className="text-slate-500 font-bold mt-2">أنشئ سيناريوهات إرسال تلقائية تعتمد على سلوك المشترك.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-2xl shadow-blue-600/30 transition-all hover:scale-105">
          <Plus size={20} />
          إنشاء رحلة ذكية
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {workflows.map(w => (
          <div key={w.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-blue-200 transition-all flex flex-col md:flex-row items-center gap-10 group">
             <div className={`p-5 rounded-3xl ${w.isActive ? 'bg-blue-50' : 'bg-slate-100 opacity-50'}`}>
                {getIcon(w.trigger)}
             </div>

             <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                   <h3 className={`text-xl font-black ${w.isActive ? 'text-slate-900' : 'text-slate-400'}`}>{w.name}</h3>
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black ${w.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                     {w.isActive ? 'نشط حالياً' : 'متوقف'}
                   </span>
                </div>
                
                <div className="flex items-center gap-6 text-slate-500 text-xs font-bold">
                   <div className="flex items-center gap-2">
                      <Zap size={14} className="text-blue-500" />
                      <span>المحفز: {w.trigger === 'on_subscribe' ? 'اشتراك جديد' : 'حدث مخصص'}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span>التأخير: {w.delay === '0' ? 'فوري' : w.delay}</span>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-4 bg-slate-50 px-8 py-4 rounded-[2rem] border border-slate-100">
                <div className="text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase">المرسلة</p>
                   <p className="text-lg font-black text-slate-900">12,450</p>
                </div>
                <div className="w-[1px] h-8 bg-slate-200 mx-2"></div>
                <div className="text-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase">التحويل</p>
                   <p className="text-lg font-black text-emerald-600">8.2%</p>
                </div>
             </div>

             <div className="flex gap-2">
                <button className="p-4 bg-slate-900 text-white rounded-2xl hover:scale-105 transition-all shadow-lg shadow-slate-900/20">
                   {w.isActive ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button className="p-4 bg-white text-slate-400 rounded-2xl border border-slate-200 hover:text-blue-600 hover:border-blue-600 transition-all">
                   <ArrowRight size={20} />
                </button>
             </div>
          </div>
        ))}

        <div className="bg-blue-50/50 border-4 border-dashed border-blue-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center space-y-4 group cursor-pointer hover:bg-blue-50 transition-all">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Plus size={32} className="text-blue-600" />
           </div>
           <h3 className="text-xl font-black text-blue-900">إضافة أتمتة مخصصة</h3>
           <p className="text-sm font-bold text-blue-400 max-w-sm">قم بربط أحداث متجرك (شراء، إضافة للسلة، خمول) بإشعارات فورية ترفع من مبيعاتك.</p>
        </div>
      </div>
    </div>
  );
};

export default AutomationView;
