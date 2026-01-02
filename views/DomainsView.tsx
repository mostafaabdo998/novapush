
import React, { useEffect, useState } from 'react';
import { LaraPushService } from '../services/laraPushService';
import { Domain } from '../types';
import { MOCK_USER } from '../constants';
import { Globe, Plus, CheckCircle, Clock, Copy, Download, Loader2, Database, AlertCircle, Bell, Code2, MousePointerClick, Layout, Tags } from 'lucide-react';

const DomainsView: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixelType, setPixelType] = useState<'bell' | 'button'>('bell');
  
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
      const added = await service.addDomain(newUrl);
      setDomains(prev => [...prev, added]);
      setNewUrl('');
      setShowAddModal(false);
      setSelectedDomain(added);
      alert("✅ تم تفعيل المتجر بنظام Segments! سيظهر الآن في لوحة لارا بوش تحت الوسوم (Tags).");
    } catch (err: any) {
      setError(err.message || "خطأ في الاتصال بالسيرفر.");
      alert("⚠️ فشل الربط: " + (err.message || "تأكد من إعدادات CORS"));
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ الكود بنجاح! ضعه الآن في متجرك.');
  };

  const getPixelCode = () => {
    const userId = MOCK_USER.id;
    const storeTag = selectedDomain?.url || 'default';
    
    if (pixelType === 'bell') {
      return `<!-- PushNova Segmented Floating Bell -->
<script>
(function() {
  var btn = document.createElement("div");
  btn.innerHTML = "🔔";
  btn.style = "position:fixed; bottom:20px; right:20px; width:64px; height:64px; background:#2563eb; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; cursor:pointer; z-index:999999; box-shadow:0 10px 25px rgba(37,99,235,0.4); border:4px solid white; transition:all 0.3s ease;";
  document.body.appendChild(btn);
  
  btn.onclick = function() {
    // نرسل الـ store_tag لضمان تصنيف المشترك في LaraPush تحت هذا المتجر
    var subUrl = "https://nbdmasr.com/subscribe.html?client_id=${userId}&store_tag=${storeTag}";
    window.open(subUrl, "PushNova", "width=500,height=600,top=100,left=100");
  };
})();
</script>`;
    } else {
      return `<!-- PushNova Segmented Button -->
<script>
  function openPushSub() {
    var storeTag = "${storeTag}";
    var url = "https://nbdmasr.com/subscribe.html?client_id=${userId}&store_tag=" + storeTag;
    window.open(url, "PushNova", "width=500,height=600,top=100,left=100");
  }
</script>
<button onclick="openPushSub()" style="background:#2563eb; color:#fff; padding:12px 28px; border:none; border-radius:12px; cursor:pointer; font-weight:bold; box-shadow:0 4px 14px rgba(37,99,235,0.3);">
    🔔 اشترك في التنبيهات
</button>`;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة المتاجر (Segments)</h1>
          <p className="text-slate-500">قم بإضافة متاجر عملائك ليتم تقسيمهم آلياً باستخدام الوسوم (Tags) في لارا بوش.</p>
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
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">المتاجر النشطة</h3>
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
                  Tag: {domain.url}
                </span>
              </div>
              <h3 className="font-black text-slate-900 text-lg truncate">{domain.url}</h3>
              <div className="flex items-center justify-between mt-4">
                 <span className="text-xs text-slate-400">مشتركي السيجمنت</span>
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
                  <h2 className="text-2xl font-black text-slate-900">إعدادات متجر {selectedDomain.url}</h2>
                  <p className="text-slate-500 mt-2 font-medium">نظام التقسيم بالوسوم (Segmentation) مفعل لهذا المتجر.</p>
                </div>
                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-xs font-black">
                   LaraPush Tag Linked
                </div>
              </div>
              
              <div className="p-10 space-y-12">
                {/* Step: Files */}
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">1</div>
                    <h3 className="font-black text-slate-900 text-lg">تحميل ملفات التفعيل (مرة واحدة)</h3>
                  </div>
                  <div className="pr-14">
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-blue-800 text-sm font-medium leading-relaxed">
                       ملاحظة: بما أننا نستخدم نظام الـ Segments، يحتاج العميل فقط لرفع ملفات المحرك الرئيسي (Service Worker) الخاصة بنطاقك الرئيسي <span className="font-black">nbdmasr.com</span> على متجره، أو الاكتفاء بكود البكسل الذكي أدناه.
                    </div>
                  </div>
                </div>

                {/* Step: Pixel Generator */}
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">2</div>
                    <h3 className="font-black text-slate-900 text-lg">كود البكسل الذكي (المتجر كسيجمنت)</h3>
                  </div>
                  <div className="pr-14 space-y-6">
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                      <button 
                        onClick={() => setPixelType('bell')}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${pixelType === 'bell' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                      >جرس عائم</button>
                      <button 
                        onClick={() => setPixelType('button')}
                        className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${pixelType === 'button' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                      >زر اشتراك</button>
                    </div>

                    <div className="relative group">
                      <pre className="bg-slate-900 text-blue-300 p-8 rounded-[2rem] text-[11px] font-mono overflow-x-auto leading-relaxed border-4 border-slate-800 shadow-2xl ltr text-left custom-scrollbar">
                        {getPixelCode()}
                      </pre>
                      <button 
                        onClick={() => copyToClipboard(getPixelCode())}
                        className="absolute top-6 right-6 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-lg flex items-center gap-2 text-xs font-bold"
                      >
                        <Copy size={16} />
                        نسخ الكود الذكي
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step: Guide */}
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">3</div>
                    <h3 className="font-black text-slate-900 text-lg">طريقة التثبيت للمتاجر</h3>
                  </div>
                  <div className="pr-14 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Layout size={18} /></div>
                         <h4 className="font-black text-slate-800">Shopify / Salla</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        الصق الكود في قسم الـ Header أو Scripts وسيتم ربط أي مشترك جديد تلقائياً بوسم <span className="font-bold text-blue-600">{selectedDomain.url}</span>.
                      </p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Code2 size={18} /></div>
                         <h4 className="font-black text-slate-800">EasyOrder</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                         ضع الكود في "أكواد التتبع" ليظهر زر الاشتراك فوراً ويبدأ بجمع جمهورك الخاص.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white rounded-[3rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center mb-6">
                <MousePointerClick size={48} />
              </div>
              <h3 className="font-black text-slate-900 text-xl">اختر متجر عميل</h3>
              <p className="text-slate-400 max-w-sm mt-3 font-medium">سيتم توليد كود البكسل الذي يحتوي على معرف السيجمنت (Tag) الخاص بالمتجر.</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900">إضافة متجر (Segment)</h2>
              <p className="text-slate-500 font-medium">سيتم إنشاء وسم جديد في LaraPush</p>
            </div>
            
            <form onSubmit={handleAddDomain} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 block mr-2">اسم المتجر أو الدومين (للتوسيم)</label>
                <div className="relative">
                  <Globe className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    required
                    disabled={isSyncing}
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="my-shopify-store.com"
                    className="w-full pr-14 pl-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-bold placeholder:text-slate-300 transition-all shadow-sm"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  disabled={isSyncing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSyncing ? <Loader2 className="animate-spin" size={20} /> : 'تفعيل السيجمنت'}
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
