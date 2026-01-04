
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { 
  Globe, Plus, CheckCircle2, AlertCircle, Trash2, 
  Settings2, Copy, ShieldCheck, X, Activity 
} from 'lucide-react';

const AppsView: React.FC = () => {
  const { apps, addApp, deleteApp } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newApp, setNewApp] = useState({ name: '', url: '', projectId: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addApp(newApp);
    setNewApp({ name: '', url: '', projectId: '' });
    setShowModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-jakarta">البنية التحتية</h1>
          <p className="text-slate-500 text-sm mt-1">إدارة المشاريع، التوثيق، ومفاتيح الربط البرمجي.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          <Plus size={16} />
          إضافة مشروع
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map(app => (
          <div key={app.id} className="glass-card rounded-2xl p-8 flex flex-col group hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${app.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{app.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{app.url}</p>
                  </div>
               </div>
               <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                 app.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
               }`}>
                 {app.status === 'active' ? 'موثق' : 'قيد المراجعة'}
               </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">المشتركون</p>
                  <p className="text-lg font-black text-slate-900">{app.subscribersCount.toLocaleString()}</p>
               </div>
               <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">نسبة التسليم</p>
                  <p className="text-lg font-black text-blue-600">98.5%</p>
               </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
               <div className="flex gap-4">
                  <button className="text-slate-400 hover:text-blue-600 transition-colors"><Settings2 size={16} /></button>
                  <button className="text-slate-400 hover:text-blue-600 transition-colors"><Activity size={16} /></button>
               </div>
               <button 
                 onClick={() => deleteApp(app.id)}
                 className="text-slate-300 hover:text-rose-500 transition-colors"
               >
                <Trash2 size={16} />
               </button>
            </div>
          </div>
        ))}

        {apps.length === 0 && (
          <div className="col-span-full py-20 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400">
             <Globe size={48} className="mb-4 opacity-20" />
             <p className="font-bold italic">لا توجد مشاريع حالية.. ابدأ بإضافة مشروعك الأول.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-extrabold text-slate-900 font-jakarta">مشروع جديد</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:bg-slate-100 p-2 rounded-lg">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase mb-2 block">اسم التطبيق/المتجر</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-blue-500/20 focus:outline-none font-bold"
                    placeholder="مثال: متجر الرياض"
                    onChange={e => setNewApp({...newApp, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase mb-2 block">رابط الموقع (Domain)</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-blue-500/20 focus:outline-none font-bold ltr"
                    placeholder="example.com"
                    onChange={e => setNewApp({...newApp, url: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  تأكيد الإضافة
                </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AppsView;
