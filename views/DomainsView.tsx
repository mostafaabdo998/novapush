
import React, { useEffect, useState } from 'react';
import { LaraPushService } from '../services/laraPushService';
import { Domain } from '../types';
import { Globe, Plus, CheckCircle, Clock, Copy, Download, Loader2, Database, AlertCircle, Bell, Code2, MousePointerClick, Layout, Tags, ShieldAlert, ExternalLink } from 'lucide-react';

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
      // تنظيف الرابط ليكون بمثابة Tag فريد
      const cleanUrl = newUrl.trim().replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
      const added = await service.addDomain(cleanUrl);
      setDomains(prev => [...prev, added]);
      setNewUrl('');
      setShowAddModal(false);
      setSelectedDomain(added);
      alert("✅ تم تفعيل السيجمنت بنجاح! كود الربط متاح الآن.");
    } catch (err: any) {
      setError(err.message || "خطأ في الاتصال بالسيرفر.");
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ الكود بنجاح! ضعه الآن في متجرك.');
  };

  const getPopUpCode = () => {
    const marketerID = selectedDomain?.url || 'default_store';
    return `<!-- PushNova Professional Pop-up Integration -->
<script>
  function initPushNova() {
    var marketerID = "${marketerID}"; 
    
    var btn = document.createElement("div");
    btn.innerHTML = "🔔";
    btn.style = "position:fixed;bottom:25px;right:25px;width:64px;height:64px;background:#28a745;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;cursor:pointer;z-index:999999;box-shadow:0 8px 20px rgba(0,0,0,0.25);border:4px solid white;transition:all 0.3s ease;";
    
    btn.onmouseover = function() { this.style.transform = "scale(1.1)"; };
    btn.onmouseout = function() { this.style.transform = "scale(1)"; };
    
    document.body.appendChild(btn);

    btn.onclick = function() {
      var width = 500, height = 580;
      var left = (screen.width/2)-(width/2);
      var top = (screen.height/2)-(height/2);
      // رابط صفحة الاشتراك المركزية مع تمرير المعرف
      var url = "https://nbdmasr.com/subscribe.html?client_id=" + marketerID;
      window.open(url, "PushNova", "width="+width+",height="+height+",top="+top+",left="+left+",resizable=no,scrollbars=no");
    };
  }
  
  // تشغيل المحرك عند تحميل الصفحة
  if (window.addEventListener) window.addEventListener("load", initPushNova, false);
  else if (window.attachEvent) window.attachEvent("onload", initPushNova);
</script>`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة المتاجر والسيجمنتس</h1>
          <p className="text-slate-500">نظام النطاق المركزي (Central Domain) لتجاوز حظر المتصفحات.</p>
        </div>
        <button 
          onClick={() => { setShowAddModal(true); setError(null); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          إضافة متجر جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">متاجرك النشطة</h3>
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain)}
              className={`w-full text-right p-6 rounded-3xl border-2 transition-all ${
                selectedDomain?.id === domain.id 
                  ? 'bg-white border-blue-600 shadow-xl shadow-blue-500/10' 
                  : 'bg-white border-slate-100 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-3 rounded-2xl ${selectedDomain?.id === domain.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                  <Tags size={24} />
                </div>
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  Segment: {domain.url}
                </span>
              </div>
              <h3 className="font-black text-slate-900 text-lg truncate">{domain.url}</h3>
              <div className="flex items-center justify-between mt-4">
                 <span className="text-xs text-slate-400">إجمالي المشتركين</span>
                 <span className="text-sm font-bold text-blue-600">{domain.subscribers.toLocaleString()}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-8">
          {selectedDomain ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="p-10 border-b border-slate-50 bg-gradient-to-l from-slate-50 to-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">كود التفعيل لمتجر {selectedDomain.url}</h2>
                  <p className="text-slate-500 mt-2 font-medium">استخدم كود الـ Pop-up الاحترافي لزيادة نسبة التحويل.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-xs font-black animate-pulse">
                   Ready for Injection
                </div>
              </div>
              
              <div className="p-10 space-y-10">
                {/* Visual Feedback on sw.js */}
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4">
                   <div className="p-3 bg-amber-500 text-white rounded-2xl shrink-0 shadow-lg shadow-amber-500/20">
                      <ShieldAlert size={24} />
                   </div>
                   <div>
                      <h4 className="font-black text-amber-900 text-md">تنبيه تقني هام (sw.js)</h4>
                      <p className="text-amber-700/80 text-xs mt-1 leading-relaxed font-medium">
                        تأكد من وجود ملف <span className="font-bold">sw.js</span> في المجلد الرئيسي لموقع <span className="underline">nbdmasr.com</span>. بدون هذا الملف، لن تظهر طلبات الإشعارات للمشتركين حتى مع وجود الكود.
                      </p>
                      <a href="#" className="inline-flex items-center gap-1 text-[10px] font-black text-amber-900 mt-2 hover:underline">
                        تحميل ملف sw.js الافتراضي <ExternalLink size={10} />
                      </a>
                   </div>
                </div>

                {/* Pop-up Code Block */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                       <Code2 className="text-blue-600" />
                       كود الـ Pop-up الاحترافي
                     </h3>
                     <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">JavaScript / Header</span>
                  </div>
                  
                  <div className="relative group">
                    <pre className="bg-slate-900 text-blue-300 p-8 rounded-[2rem] text-[11px] font-mono overflow-x-auto leading-relaxed border-4 border-slate-800 shadow-2xl ltr text-left custom-scrollbar">
                      {getPopUpCode()}
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(getPopUpCode())}
                      className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
                    >
                      <Copy size={16} />
                      نسخ كود الربط
                    </button>
                  </div>
                </div>

                {/* Integration Guides */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                         <Layout size={20} />
                      </div>
                      <h5 className="font-black text-slate-900 text-sm mb-2">Salla / EasyOrder</h5>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed">اذهب للإعدادات {'>'} "أكواد مخصصة" {'>'} Header والصق الكود.</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                         <Code2 size={20} />
                      </div>
                      <h5 className="font-black text-slate-900 text-sm mb-2">Shopify</h5>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed">اذهب لـ Themes {'>'} Edit Code {'>'} theme.liquid والصقه قبل {`</body>`}.</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-colors">
                      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                         <Bell size={20} />
                      </div>
                      <h5 className="font-black text-slate-900 text-sm mb-2">WooCommerce</h5>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed">استخدم إضافة "Insert Headers and Footers" وضع الكود في الـ Header.</p>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center mb-6">
                <MousePointerClick size={48} />
              </div>
              <h3 className="font-black text-slate-900 text-xl">اختر متجر عميل للمتابعة</h3>
              <p className="text-slate-400 max-w-sm mt-3 font-medium">سيتم توليد كود الـ Pop-up الفريد المخصص لهذا المتجر لضمان تقسيم المشتركين بشكل آلي.</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900">إضافة سيجمنت جديد</h2>
              <p className="text-slate-500 font-medium">سيتم ربط المشتركين بوسم (Tag) خاص</p>
            </div>
            
            <form onSubmit={handleAddDomain} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 block mr-2">رابط المتجر (بدون https)</label>
                <div className="relative">
                  <Globe className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    required
                    disabled={isSyncing}
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="mystore.com"
                    className="w-full pr-14 pl-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-bold shadow-sm transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={isSyncing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSyncing ? <Loader2 className="animate-spin" size={20} /> : 'تفعيل المتجر'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-8 py-4 text-slate-400 font-black hover:bg-slate-50 rounded-2xl transition-all"
                >تراجع</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainsView;
