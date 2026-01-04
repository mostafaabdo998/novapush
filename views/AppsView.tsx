
import React, { useEffect, useState } from 'react';
import { FCMService } from '../services/fcmService';
import { AppInstance } from '../types';
import { Globe, Plus, CheckCircle2, AlertCircle, ShieldCheck, Settings2, Trash2, Key, ChevronRight, Activity, Copy } from 'lucide-react';

const AppsView: React.FC = () => {
  const [apps, setApps] = useState<AppInstance[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  
  const service = FCMService.getInstance();

  useEffect(() => {
    service.getApps().then(setApps);
  }, []);

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    await service.verifyDomain(id);
    setVerifyingId(null);
    service.getApps().then(setApps);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ كود التحقق!');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900">المواقع الموثقة</h1>
          <p className="text-slate-500 font-bold mt-2">إدارة البنية التحتية والمفاتيح لكل مشروع في Firebase.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-2xl shadow-blue-600/30 hover:scale-105 transition-all"
        >
          <Plus size={20} />
          إضافة موقع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {apps.map(app => (
          <div key={app.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
            <div className="p-10 flex-1 space-y-8">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl ${app.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                       <Globe size={28} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900">{app.name}</h3>
                       <p className="text-xs text-slate-400 font-bold">{app.url}</p>
                    </div>
                 </div>
                 <div className="flex flex-col items-end">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${
                      app.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                      {app.status === 'active' ? 'نشط وموثق' : 'بانتظار التحقق'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold mt-2">خطة: {app.plan.toUpperCase()}</span>
                 </div>
              </div>

              {app.status === 'pending_verification' && (
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl space-y-4">
                   <div className="flex items-start gap-3">
                      <AlertCircle className="text-amber-600 shrink-0" size={18} />
                      <div className="text-xs font-bold text-amber-900 leading-relaxed">
                        يرجى إضافة كود الـ Meta التالي لموقعك لإثبات الملكية وتفعيل الربط مع FCM:
                      </div>
                   </div>
                   <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-amber-200">
                      <code className="text-[10px] font-mono text-slate-700 flex-1 truncate">
                        &lt;meta name="pushnova-verification" content="{app.verificationToken}" /&gt;
                      </code>
                      <button onClick={() => copyToClipboard(app.verificationToken)} className="text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition-all"><Copy size={16} /></button>
                   </div>
                   <button 
                     onClick={() => handleVerify(app.id)}
                     disabled={verifyingId === app.id}
                     className="w-full py-3 bg-amber-600 text-white rounded-xl text-xs font-black shadow-lg shadow-amber-600/20 disabled:opacity-50"
                   >
                     {verifyingId === app.id ? 'جاري الفحص...' : 'فحص التوثيق الآن'}
                   </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">المشتركون</p>
                    <p className="text-2xl font-black text-slate-900">{app.subscribersCount.toLocaleString()}</p>
                 </div>
                 <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">نسبة التسليم</p>
                    <p className="text-2xl font-black text-blue-600">98.2%</p>
                 </div>
              </div>
            </div>

            <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
               <div className="flex gap-4">
                  <button className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-600 transition-all">
                    <Settings2 size={16} /> الإعدادات المتقدمة
                  </button>
                  <button className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-blue-600 transition-all">
                    <Key size={16} /> مفاتيح API
                  </button>
               </div>
               <button className="p-3 text-slate-300 hover:text-rose-500 transition-all hover:bg-rose-50 rounded-xl"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}

        <div className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:bg-white hover:border-blue-200 transition-all duration-500">
           <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus size={32} className="text-slate-300 group-hover:text-blue-600" />
           </div>
           <h3 className="text-xl font-black text-slate-400 group-hover:text-blue-900">ربط مشروع جديد</h3>
        </div>
      </div>
    </div>
  );
};

export default AppsView;
