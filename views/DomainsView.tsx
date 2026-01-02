
import React, { useEffect, useState } from 'react';
import { LaraPushService } from '../services/laraPushService';
import { Domain } from '../types';
import { MOCK_USER } from '../constants';
import { Globe, Plus, CheckCircle, Clock, Copy, Download, Loader2, Database, AlertCircle, Bell, Code2, MousePointerClick, Layout, Tags, ShieldAlert, ExternalLink, Info, Check } from 'lucide-react';

const DomainsView: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const service = LaraPushService.getInstance();

  useEffect(() => {
    service.getDomains().then(setDomains);
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setIsSyncing(true);
    setError(null);
    try {
      // تنظيف الرابط ليكون بمثابة Tag فريد (Segment)
      const cleanUrl = newUrl.trim().replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
      const added = await service.addDomain(cleanUrl);
      setDomains(prev => [...prev, added]);
      setNewUrl('');
      setShowAddModal(false);
      setSelectedDomain(added);
      alert("✅ تم تفعيل المتجر كسيجمنت مستهدف بنجاح!");
    } catch (err: any) {
      setError(err.message || "خطأ في الاتصال بالسيرفر.");
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ الكود بنجاح! ضعه الآن في قسم Header في متجر العميل.');
  };

  const getPopUpCode = () => {
    const marketerID = selectedDomain?.url || 'default_store';
    return `<!-- PushNova Professional Pop-up Integration -->
<script>
  (function() {
    function initPushNova() {
      var marketerID = "${marketerID}"; 
      
      var btn = document.createElement("div");
      btn.innerHTML = "🔔";
      btn.style = "position:fixed;bottom:25px;right:25px;width:64px;height:64px;background:#28a745;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;cursor:pointer;z-index:999999;box-shadow:0 8px 25px rgba(0,0,0,0.2);border:4px solid white;transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);";
      
      btn.onmouseover = function() { this.style.transform = "scale(1.1) rotate(10deg)"; };
      btn.onmouseout = function() { this.style.transform = "scale(1) rotate(0deg)"; };
      
      document.body.appendChild(btn);

      btn.onclick = function() {
        var width = 500, height = 580;
        var left = (screen.width/2)-(width/2);
        var top = (screen.height/2)-(height/2);
        // التوجيه للنطاق المركزي nbdmasr.com لضمان عمل الـ Service Worker
        var url = "https://nbdmasr.com/subscribe.html?client_id=" + marketerID;
        window.open(url, "PushNova", "width="+width+",height="+height+",top="+top+",left="+left+",resizable=no,scrollbars=no");
      };
    }
    
    if (document.readyState === "complete") initPushNova();
    else window.addEventListener("load", initPushNova);
  })();
</script>`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">إدارة المتاجر والسيجمنتس</h1>
          <p className="text-slate-500 font-medium">استخدم قوة النطاق المركزي (Central Domain) لتجاوز قيود المتصفحات.</p>
        </div>
        <button 
          onClick={() => { setShowAddModal(true); setError(null); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          إضافة متجر جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stores List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">متاجر عملائك</h3>
          {domains.length === 0 ? (
            <div className="p-10 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-center">
               <Globe size={40} className="mx-auto text-slate-200 mb-3" />
               <p className="text-sm text-slate-400 font-bold">لم تضف أي متجر بعد</p>
            </div>
          ) : (
            domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain)}
                className={`w-full text-right p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                  selectedDomain?.id === domain.id 
                    ? 'bg-white border-blue-600 shadow-2xl shadow-blue-500/10 scale-[1.02]' 
                    : 'bg-white border-slate-100 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-3 rounded-2xl transition-colors ${selectedDomain?.id === domain.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                    <Tags size={24} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black border transition-colors ${
                    selectedDomain?.id === domain.id ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    Segment: {domain.url}
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-lg truncate">{domain.url}</h3>
                <div className="flex items-center justify-between mt-4">
                   <span className="text-xs text-slate-400 font-medium">إجمالي المشتركين</span>
                   <span className="text-sm font-black text-blue-600">{domain.subscribers.toLocaleString()}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Integration Details View */}
        <div className="lg:col-span-2 space-y-8">
          {selectedDomain ? (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden animate-in slide-in-from-left-4">
              <div className="p-10 border-b border-slate-50 bg-gradient-to-l from-slate-50/50 to-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">إعدادات الربط: {selectedDomain.url}</h2>
                  <p className="text-slate-500 mt-1 font-medium italic">يتم تقسيم المشتركين آلياً عبر نظام التوسيم (Tagging).</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                   <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-black">Central Domain Active</span>
                   <span className="text-[9px] text-slate-400 font-mono tracking-tighter">Engine: push.nbdmasr.com</span>
                </div>
              </div>
              
              <div className="p-10 space-y-12">
                {/* Critical Technical Alert */}
                <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[2rem] flex items-start gap-5 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform"></div>
                   <div className="p-4 bg-rose-600 text-white rounded-2xl shrink-0 shadow-xl shadow-rose-500/30">
                      <ShieldAlert size={28} />
                   </div>
                   <div className="relative z-10">
                      <h4 className="font-black text-rose-900 text-lg">خطوة تقنية حاسمة (Service Worker)</h4>
                      <p className="text-rose-700/80 text-sm mt-2 leading-relaxed font-bold">
                        بما أن صفحة الاشتراك تفتح على النطاق <span className="underline decoration-rose-400 decoration-2">nbdmasr.com</span>، يجب عليك التأكد من رفع ملف <span className="bg-rose-200 px-1.5 rounded">sw.js</span> (أو <span className="bg-rose-200 px-1.5 rounded">service-worker.js</span>) في المجلد الرئيسي <span className="italic">(public_html)</span> لهذا النطاق تحديداً.
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                         <button className="text-[11px] font-black bg-rose-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-rose-950 transition-colors">
                            <Download size={14} /> تحميل ملف sw.js لـ nbdmasr.com
                         </button>
                      </div>
                   </div>
                </div>

                {/* Pop-up Integration Code */}
                <div className="space-y-5">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/30">1</div>
                        <h3 className="font-black text-slate-900 text-xl">كود الـ Pop-up (الربط المباشر)</h3>
                      </div>
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Recommended</span>
                   </div>
                   
                   <div className="pr-14 space-y-4">
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        هذا الكود يظهر "جرساً" عائماً في متجر العميل، وبمجرد الضغط عليه تفتح نافذة الاشتراك الاحترافية على الدومين المركزي.
                      </p>
                      <div className="relative group">
                        <pre className="bg-slate-900 text-blue-300 p-8 rounded-[2.5rem] text-[11px] font-mono overflow-x-auto leading-relaxed border-4 border-slate-800 shadow-2xl ltr text-left custom-scrollbar">
                          {getPopUpCode()}
                        </pre>
                        <button 
                          onClick={() => copyToClipboard(getPopUpCode())}
                          className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-blue-500/40 transition-all hover:scale-105 active:scale-95"
                        >
                          <Copy size={18} />
                          نسخ الكود المتكامل
                        </button>
                      </div>
                   </div>
                </div>

                {/* Platform Specific Help */}
                <div className="space-y-5">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-lg">2</div>
                    <h3 className="font-black text-slate-900 text-xl">دليل التثبيت السريع</h3>
                  </div>
                  <div className="pr-14 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:border-blue-600 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Layout size={24} /></div>
                         <h4 className="font-black text-slate-900">Salla / EasyOrder</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-bold">
                        توجه إلى "أكواد التتبع" {'>'} "Header"، والصق الكود مباشرة. سيظهر الجرس فوراً ويبدأ بجمع المشتركين تحت وسم <span className="text-blue-600">{selectedDomain.url}</span>.
                      </p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2 text-[10px] font-bold text-slate-700"><Check size={12} className="text-emerald-500" /> متوافق مع كافة قوالب سلة</li>
                        <li className="flex items-center gap-2 text-[10px] font-bold text-slate-700"><Check size={12} className="text-emerald-500" /> تجاوز حظر الإشعارات التلقائي</li>
                      </ul>
                    </div>
                    
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:border-blue-600 transition-all">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Code2 size={24} /></div>
                         <h4 className="font-black text-slate-900">Shopify / Meta</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-bold">
                         في Shopify، اذهب لـ Theme {'>'} Edit Code {'>'} theme.liquid والصق الكود قبل وسم {`</body>`}.
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-[10px] bg-white p-3 rounded-xl border border-slate-100 font-black text-slate-400">
                        <Info size={14} className="text-blue-400" />
                        نصيحة: اختبر الجرس من متصفح خفي (Incognito).
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[550px] bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 text-center shadow-inner">
              <div className="w-28 h-28 bg-blue-50 text-blue-200 rounded-[2rem] flex items-center justify-center mb-8 rotate-12 group-hover:rotate-0 transition-transform">
                <MousePointerClick size={56} />
              </div>
              <h3 className="font-black text-slate-900 text-2xl mb-2">اختر متجراً من القائمة</h3>
              <p className="text-slate-400 max-w-sm font-medium leading-relaxed">
                حدد أحد المتاجر المسجلة لعرض كود الـ Pop-up المخصص وإرشادات الربط التقني.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Store Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-lg p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-12 space-y-10 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/40">
                <Plus size={36} />
              </div>
              <h2 className="text-3xl font-black text-slate-900">إضافة متجر جديد</h2>
              <p className="text-slate-500 font-bold">سيتم إنشاء سيجمنت (Tag) مخصص في LaraPush</p>
            </div>
            
            <form onSubmit={handleAddDomain} className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-black text-slate-800 block mr-2 tracking-wide">رابط المتجر (أو اسم تعريفي)</label>
                <div className="relative group">
                  <Globe className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={24} />
                  <input 
                    type="text" 
                    required
                    disabled={isSyncing}
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="my-store.com"
                    className="w-full pr-16 pl-8 py-5 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-black shadow-sm transition-all text-lg placeholder:text-slate-200"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={isSyncing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black shadow-2xl shadow-blue-500/40 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
                >
                  {isSyncing ? <Loader2 className="animate-spin" size={24} /> : 'تأكيد التفعيل'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-8 py-5 text-slate-400 font-black hover:bg-slate-50 rounded-2xl transition-all text-lg"
                >إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainsView;
