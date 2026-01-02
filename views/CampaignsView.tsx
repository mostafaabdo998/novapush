
import React, { useEffect, useState } from 'react';
import { LaraPushService } from '../services/laraPushService';
import { Campaign, Domain } from '../types';
import { Send, Plus, CheckCircle, Bell, Smartphone, Globe, ShieldCheck, Lock, Tags } from 'lucide-react';

const CampaignsView: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segments, setSegments] = useState<Domain[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    url: '',
    targetDomains: [] as string[] // هنا تمثل الـ Tags
  });
  
  const service = LaraPushService.getInstance();

  useEffect(() => {
    service.getCampaigns().then(setCampaigns);
    service.getDomains().then(setSegments);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.targetDomains.length === 0) {
      alert("يرجى تحديد سيجمنت واحد على الأقل للإرسال");
      return;
    }
    
    setIsSending(true);
    await service.sendNotification(formData);
    setIsSending(false);
    setShowModal(false);
    setFormData({ title: '', message: '', url: '', targetDomains: [] });
    service.getCampaigns().then(setCampaigns);
    alert("🚀 تم إرسال الحملة بنجاح عبر نظام الـ Tags!");
  };

  const toggleSegment = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      targetDomains: prev.targetDomains.includes(tag)
        ? prev.targetDomains.filter(t => t !== tag)
        : [...prev.targetDomains, tag]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">حملات الإرسال الذكية</h1>
          <p className="text-slate-500 font-medium">توجيه الإشعارات لجمهور محدد بناءً على الوسوم (Tags).</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Plus size={20} />
          إنشاء حملة مستهدفة
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-sm font-black text-slate-400">محتوى الحملة</th>
              <th className="px-8 py-5 text-sm font-black text-slate-400">السيجمنت المستهدف</th>
              <th className="px-8 py-5 text-sm font-black text-slate-400">الوصول</th>
              <th className="px-8 py-5 text-sm font-black text-slate-400">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-8 py-6">
                  <div className="font-black text-slate-900 text-md">{c.title}</div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">{c.message}</div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex gap-2 flex-wrap">
                     {c.targetDomains.map(tag => (
                       <span key={tag} className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 font-black">Tag: {tag}</span>
                     ))}
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">{c.sentCount.toLocaleString()}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">نموذج الإرسال: Tag-Based</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black shadow-sm">
                    <CheckCircle size={12} />
                    تم الإرسال
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in slide-in-from-bottom-10">
            
            <div className="flex-1 p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl font-black text-slate-900">تجهيز الحملة بنظام السيجمنت</h2>

              <form onSubmit={handleSend} className="space-y-8">
                <div className="space-y-4 bg-slate-50/50 p-8 rounded-[2rem] border-2 border-slate-100">
                   <label className="text-sm font-black text-slate-700 flex items-center gap-2 mb-4">
                     <Tags size={20} className="text-blue-600" />
                     اختر المتاجر المستهدفة (LaraPush Tags):
                   </label>
                   <div className="flex flex-wrap gap-3">
                     {segments.map(s => (
                       <button
                         key={s.id}
                         type="button"
                         onClick={() => toggleSegment(s.url)}
                         className={`px-6 py-3 rounded-2xl text-sm font-black border-2 transition-all ${
                           formData.targetDomains.includes(s.url)
                             ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30'
                             : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                         }`}
                       >
                         {s.url}
                       </button>
                     ))}
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium italic">ملاحظة: سيتم إرسال الإشعار فقط للمشتركين الذين يحملون وسم المتجر المختار في قاعدة بيانات لارا بوش.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <input 
                    type="text" required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="عنوان الإشعار..."
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-bold shadow-sm transition-all"
                  />
                  <textarea 
                    rows={3} required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="محتوى الرسالة التسويقية..."
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-bold shadow-sm transition-all resize-none"
                  ></textarea>
                  <input 
                    type="url" required
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    placeholder="رابط الهبوط (https://...)"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-bold shadow-sm transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit" disabled={isSending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/40 transition-all"
                  >
                    {isSending ? 'جاري الفلترة والإرسال...' : 'إرسال لسيجمنت العميل'}
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} className="px-10 py-5 text-slate-400 font-black hover:bg-slate-50 rounded-2xl">إلغاء</button>
                </div>
              </form>
            </div>

            <div className="w-[400px] bg-slate-900 p-12 hidden lg:flex flex-col items-center justify-center">
               <h3 className="text-xs font-black text-blue-400 mb-10 uppercase tracking-widest">معاينة الهاتف</h3>
               <div className="w-full max-w-[250px] aspect-[9/18.5] bg-black rounded-[3rem] border-[8px] border-slate-800 p-3 relative shadow-2xl">
                 <div className="mt-14 px-2">
                    <div className="bg-white/95 rounded-xl p-4 shadow-2xl border border-white/20">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex-shrink-0 flex items-center justify-center shadow-lg">
                          <Bell size={20} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-black text-slate-900 truncate">{formData.title || 'عنوان الحملة'}</h4>
                          <p className="text-[9px] text-slate-600 line-clamp-2 mt-1 font-medium">{formData.message || 'محتوى الإشعار المستهدف...'}</p>
                        </div>
                      </div>
                    </div>
                 </div>
               </div>
               <div className="mt-10 p-4 bg-white/5 rounded-2xl border border-white/10 w-full">
                  <div className="flex items-center gap-2 mb-2">
                     <ShieldCheck size={14} className="text-emerald-400" />
                     <span className="text-slate-400 font-black text-[10px]">LaraPush Logic: Tag Targeting</span>
                  </div>
                  <code className="text-[9px] text-blue-300 font-mono block">
                    POST /api/createCampaign<br/>
                    Body: {`{ tags: ["${formData.targetDomains.join('", "') || 'tag_name'}"] }`}
                  </code>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsView;
