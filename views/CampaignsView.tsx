
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Send, Plus, Bell, Smartphone, Monitor, CheckCircle, Info, Sparkles, X } from 'lucide-react';

const CampaignsView: React.FC = () => {
  const { apps, campaigns, sendNotification } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', url: '', targetDomains: [] as string[] });
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    await sendNotification(formData);
    setIsSending(false);
    setShowModal(false);
    setFormData({ title: '', message: '', url: '', targetDomains: [] });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-jakarta">الحملات والبث</h1>
          <p className="text-slate-500 text-sm mt-1">توجيه الإشعارات للجمهور المستهدف عبر بروتوكولات HTTP/2.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={16} />
          حملة جديدة
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden">
             <table className="w-full text-right border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                   <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">محتوى الحملة</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">التفاعل</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">الحالة</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {campaigns.length === 0 ? (
                     <tr>
                        <td colSpan={3} className="px-6 py-20 text-center text-slate-300 font-bold italic">لا توجد حملات مرسلة بعد.</td>
                     </tr>
                   ) : (
                     campaigns.map(c => (
                       <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5">
                             <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                             <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">{c.message}</p>
                          </td>
                          <td className="px-6 py-5 text-center">
                             <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900">{c.stats.sent.toLocaleString()}</span>
                                <span className="text-[9px] text-emerald-500 font-bold">وصول مرتفع</span>
                             </div>
                          </td>
                          <td className="px-6 py-5">
                             <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">مكتمل</span>
                          </td>
                       </tr>
                     ))
                   )}
                </tbody>
             </table>
          </div>
        </div>

        <div className="space-y-6">
           <div className="glass-card rounded-2xl p-8 bg-blue-600 text-white shadow-xl shadow-blue-100">
              <Sparkles size={24} className="mb-4 text-blue-200" />
              <h4 className="font-bold mb-2 text-sm">تلميحة الذكاء الاصطناعي</h4>
              <p className="text-xs text-blue-100 font-medium leading-relaxed">
                استخدم العناوين القصيرة (أقل من 40 حرفاً) لزيادة نسبة النقر بمعدل 15% على أجهزة الأندرويد.
              </p>
           </div>
           
           <div className="glass-card rounded-2xl p-8">
              <h4 className="font-bold text-slate-900 mb-4 text-sm">نصائح البث:</h4>
              <div className="space-y-4">
                 <div className="flex gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Smartphone size={16} /></div>
                    <div className="text-[10px] text-slate-500 font-bold">صور الإشعارات (Big Image) مدعومة في الأندرويد فقط.</div>
                 </div>
                 <div className="flex gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Monitor size={16} /></div>
                    <div className="text-[10px] text-slate-500 font-bold">المتصفحات تتطلب تفاعلاً أولياً من المستخدم لعرض الإشعار.</div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
           <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] animate-in zoom-in-95">
              {/* Form Section */}
              <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
                 <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-extrabold text-slate-900 font-jakarta">بث حملة جديدة</h2>
                    <button onClick={() => setShowModal(false)} className="md:hidden text-slate-400 p-2"><X size={18} /></button>
                 </div>
                 <form onSubmit={handleSend} className="space-y-6">
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">المشروع المستهدف</label>
                       <select 
                         required
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                         onChange={e => setFormData({...formData, targetDomains: [e.target.value]})}
                       >
                          <option value="">اختر مشروعاً...</option>
                          {apps.map(app => <option key={app.id} value={app.url}>{app.name}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">عنوان الإشعار</label>
                       <input 
                         type="text" required
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
                         placeholder="أدخل عنواناً جذاباً..."
                         onChange={e => setFormData({...formData, title: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">محتوى الرسالة</label>
                       <textarea 
                         required rows={3}
                         className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold resize-none"
                         placeholder="اكتب رسالتك هنا..."
                         onChange={e => setFormData({...formData, message: e.target.value})}
                       ></textarea>
                    </div>
                    <button 
                      type="submit" disabled={isSending}
                      className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                      {isSending ? 'جاري البث...' : <><Send size={18} /> إطلاق الحملة الآن</>}
                    </button>
                 </form>
              </div>

              {/* Preview Section */}
              <div className="w-80 bg-slate-50 border-r border-slate-100 p-10 flex flex-col items-center justify-center">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase mb-8 tracking-widest">معاينة الهاتف</h4>
                 <div className="w-56 h-[400px] bg-black rounded-[2.5rem] border-[6px] border-slate-800 p-3 relative shadow-2xl">
                    <div className="w-12 h-1 bg-slate-800 rounded-full mx-auto mb-10"></div>
                    <div className="bg-white/95 rounded-xl p-3 shadow-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                       <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                          <Bell size={16} className="text-white" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-900 truncate">{formData.title || 'العنوان يظهر هنا'}</p>
                          <p className="text-[8px] text-slate-500 line-clamp-2 leading-tight">{formData.message || 'نص الرسالة سيظهر للمشتركين بهذا الشكل..'}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsView;
