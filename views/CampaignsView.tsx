
import React, { useEffect, useState } from 'react';
import { LaraPushService } from '../services/laraPushService';
import { Campaign, Domain } from '../types';
import { Send, Plus, CheckCircle, Bell, Smartphone, Globe, ShieldCheck, Lock } from 'lucide-react';

const CampaignsView: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    url: '',
    targetDomains: [] as string[]
  });
  
  const service = LaraPushService.getInstance();

  useEffect(() => {
    service.getCampaigns().then(setCampaigns);
    service.getDomains().then(setDomains);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.targetDomains.length === 0) {
      alert("يرجى تحديد موقع واحد على الأقل للإرسال");
      return;
    }
    
    setIsSending(true);
    await service.sendNotification(formData);
    setIsSending(false);
    setShowModal(false);
    setFormData({ title: '', message: '', url: '', targetDomains: [] });
    service.getCampaigns().then(setCampaigns);
  };

  const toggleDomain = (domainUrl: string) => {
    setFormData(prev => ({
      ...prev,
      targetDomains: prev.targetDomains.includes(domainUrl)
        ? prev.targetDomains.filter(d => d !== domainUrl)
        : [...prev.targetDomains, domainUrl]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">حملات الإرسال</h1>
          <p className="text-slate-500 font-medium">إرسال إشعارات فورية عبر محرك LaraPush API.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Plus size={20} />
          إنشاء حملة ذكية
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-sm font-black text-slate-400">محتوى الحملة</th>
              <th className="px-8 py-5 text-sm font-black text-slate-400">النطاقات المستهدفة</th>
              <th className="px-8 py-5 text-sm font-black text-slate-400">الوصول الفعلي</th>
              <th className="px-8 py-5 text-sm font-black text-slate-400">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {campaigns.map((c) => (
              <tr key={c.id} className="hover:bg-blue-50/20 transition-colors">
                <td className="px-8 py-6">
                  <div className="font-black text-slate-900 text-md">{c.title}</div>
                  <div className="text-xs text-slate-400 mt-1 font-medium truncate max-w-xs">{c.message}</div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex gap-2 flex-wrap">
                     {c.targetDomains.map(d => (
                       <span key={d} className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 font-black tracking-tight">{d}</span>
                     ))}
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900">{c.sentCount.toLocaleString()} مستلم</span>
                      <span className="text-[10px] text-emerald-600 font-bold mt-1">CTR: {((c.clickCount/c.sentCount)*100).toFixed(1)}%</span>
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
          <div className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in slide-in-from-bottom-10 duration-500">
            
            <div className="flex-1 p-10 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900">تجهيز الحملة</h2>
                <div className="flex items-center gap-2 text-[10px] text-blue-600 font-black bg-blue-50 px-4 py-2 rounded-full border border-blue-100 shadow-sm">
                   <Lock size={14} />
                   API Wrapper Enabled
                </div>
              </div>

              <form onSubmit={handleSend} className="space-y-8">
                <div className="space-y-4 bg-slate-50/50 p-8 rounded-[2rem] border-2 border-slate-100">
                   <label className="text-sm font-black text-slate-700 flex items-center gap-2 mb-4">
                     <Globe size={20} className="text-blue-600" />
                     توجيه الإرسال لجمهور موقع معين:
                   </label>
                   <div className="flex flex-wrap gap-3">
                     {domains.map(d => (
                       <button
                         key={d.id}
                         type="button"
                         onClick={() => toggleDomain(d.url)}
                         className={`px-6 py-3 rounded-2xl text-sm font-black border-2 transition-all ${
                           formData.targetDomains.includes(d.url)
                             ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105'
                             : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                         }`}
                       >
                         {d.url}
                       </button>
                     ))}
                   </div>
                   <p className="text-[10px] text-slate-400 font-medium">هام: سيقوم النظام بفلترة قاعدة بيانات المشتركين (lp_db) بناءً على النطاقات المختارة فقط.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-700 mr-2">عنوان الإشعار القوي</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="اكتب عنواناً يحفز على النقر..."
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-bold shadow-sm transition-all"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-700 mr-2">محتوى الرسالة</label>
                    <textarea 
                      rows={3}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="اكتب تفاصيل العرض أو الخبر هنا..."
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-bold shadow-sm transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-700 mr-2">رابط الهبوط (Target URL)</label>
                    <input 
                      type="url" 
                      required
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                      placeholder="https://example.com/promo"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-bold shadow-sm transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6 sticky bottom-0 bg-white pb-4">
                  <button 
                    type="submit"
                    disabled={isSending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-500/40 transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95"
                  >
                    {isSending ? (
                      <span className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري معالجة الـ API...
                      </span>
                    ) : (
                      <>
                        <Send size={22} />
                        إرسال لجميع المشتركين
                      </>
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-10 py-5 text-slate-400 font-black hover:bg-slate-50 rounded-2xl transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>

            <div className="w-full md:w-[400px] bg-slate-900 p-12 flex flex-col items-center justify-center hidden lg:flex relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                 <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-500 rounded-full blur-3xl"></div>
              </div>

              <h3 className="text-xs font-black text-blue-400 mb-10 uppercase tracking-widest z-10">معاينة الهاتف الحقيقية</h3>
              
              <div className="w-full max-w-[280px] aspect-[9/18.5] bg-black rounded-[3.5rem] border-[10px] border-slate-800 p-3 relative shadow-2xl z-10 ring-4 ring-slate-800/50">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-800 rounded-b-[1.5rem] flex items-center justify-center">
                   <div className="w-12 h-1 bg-black rounded-full opacity-30"></div>
                </div>
                
                <div className="mt-14 px-2">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/20 transform rotate-[-1deg] animate-in slide-in-from-top-4 duration-700">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex-shrink-0 flex items-center justify-center shadow-lg shadow-blue-500/40">
                        <Bell size={24} className="text-white fill-white/20" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[11px] font-black text-slate-900 truncate leading-tight">{formData.title || 'عنوان الإشعار الذكي'}</h4>
                        <p className="text-[10px] text-slate-600 line-clamp-2 mt-1 font-medium leading-relaxed">{formData.message || 'سيظهر محتوى رسالتك التسويقية هنا بشكل جذاب...'}</p>
                        <div className="mt-2 text-[8px] text-blue-500 font-black uppercase tracking-tighter">WWW.PUSHNOVA.COM</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-slate-800 rounded-full"></div>
              </div>

              <div className="mt-12 space-y-4 w-full z-10">
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md text-[10px] leading-relaxed shadow-2xl">
                   <div className="flex items-center gap-2 mb-3">
                      <ShieldCheck size={14} className="text-emerald-400" />
                      <span className="text-slate-400 font-black">LOG: API_GATEWAY_V2</span>
                   </div>
                   <code className="text-blue-300 block font-mono">
                     PUSH /api/createCampaign HTTP/1.1<br/>
                     Auth: Injected_Admin_Bearer<br/>
                     Filter: {JSON.stringify(formData.targetDomains)}
                   </code>
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
