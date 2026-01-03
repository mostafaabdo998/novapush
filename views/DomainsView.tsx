
import React, { useEffect, useState } from 'react';
import { LaraPushService } from '../services/laraPushService';
import { Domain } from '../types';
import { Globe, Plus, Copy, Loader2, Tags, Code2, MousePointerClick, Layout, Check, Info, Bell, Monitor } from 'lucide-react';

const DomainsView: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [linkType, setLinkType] = useState<'domain' | 'segment'>('segment');
  const [isSyncing, setIsSyncing] = useState(false);
  
  const service = LaraPushService.getInstance();

  useEffect(() => {
    service.getDomains().then(setDomains);
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setIsSyncing(true);
    try {
      const added = await service.addDomain(newUrl, linkType);
      setDomains(prev => [...prev, added]);
      setNewUrl('');
      setShowAddModal(false);
      setSelectedDomain(added);
      alert("✅ تم إضافة المتجر بنجاح! انسخ كود التفعيل الآن.");
    } catch (err) {
      alert("⚠️ حدث خطأ أثناء التسجيل.");
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ الكود! ضعه الآن في متجرك لتبدأ في جمع المشتركين.');
  };

  const getIntegrationCode = () => {
    // كود الجرس الديناميكي الذي ينسخه المسوق
    return `<script>
(function() {
    // 1. إنشاء الزر العائم
    var bell = document.createElement("div");
    bell.innerHTML = "🔔"; 
    bell.style = "position:fixed;bottom:20px;right:20px;width:60px;height:60px;background:#28a745;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:30px;cursor:pointer;z-index:999999;box-shadow:0 4px 15px rgba(0,0,0,0.3);";
    document.body.appendChild(bell);

    // 2. برمجة حدث الضغط
    bell.onclick = function() {
        var w = 450, h = 550;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        
        // جلب دومين المسوق تلقائياً لإرساله كـ Tag
        var storeDomain = window.location.hostname; 
        var subUrl = "https://nbdmasr.com/subscribe.html?tag=" + storeDomain;

        window.open(subUrl, "NotificationSystem", "width="+w+",height="+h+",top="+top+",left="+left);
    };
})();
</script>`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">المتاجر والربط</h1>
          <p className="text-slate-500 font-medium">قم بإدارة المواقع التي ترسل لها الإشعارات وانسخ كود الربط.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Plus size={20} />
          إضافة متجر جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List of Stores */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">قائمة المتاجر</h3>
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain)}
              className={`w-full text-right p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                selectedDomain?.id === domain.id 
                  ? 'bg-white border-blue-600 shadow-2xl shadow-blue-500/10' 
                  : 'bg-white border-slate-100 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-3 rounded-2xl ${selectedDomain?.id === domain.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Globe size={24} />
                </div>
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black">نشط</span>
              </div>
              <h3 className="font-black text-slate-900 text-lg truncate">{domain.url}</h3>
              <div className="flex items-center justify-between mt-4">
                 <span className="text-xs text-slate-400 font-medium">المشتركين</span>
                 <span className="text-sm font-black text-blue-600">{(domain.subscribers ?? 0).toLocaleString()}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Integration Details */}
        <div className="lg:col-span-2">
          {selectedDomain ? (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
              <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedDomain.url}</h2>
                  <p className="text-slate-500 font-bold">نظام الربط: "الجرس العائم" (SaaS Mode)</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-black">
                  <Check size={14} /> الربط فعال
                </div>
              </div>
              
              <div className="p-10 space-y-8">
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4">
                  <Info className="text-blue-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-black text-blue-900 text-sm">كيف يعمل الكود؟</h4>
                    <p className="text-blue-800/70 text-xs font-bold leading-relaxed mt-1">
                      هذا الكود يفتح نافذة اشتراك مركزية على دومين المنصة <span className="underline">nbdmasr.com</span> ويقوم تلقائياً بربط المشترك بمتجرك عبر الـ Tag. لا حاجة لرفع أي ملفات على استضافتك.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                    <Code2 className="text-blue-600" />
                    كود "الجرس" للمسوق
                  </h3>
                  
                  <div className="relative">
                    <pre className="bg-slate-900 text-blue-300 p-8 rounded-[2rem] text-[11px] font-mono overflow-x-auto ltr text-left leading-relaxed border-4 border-slate-800 shadow-xl">
                      {getIntegrationCode()}
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(getIntegrationCode())}
                      className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-blue-500/30 transition-all hover:scale-105"
                    >
                      <Copy size={18} />
                      نسخ الكود
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><Monitor size={20} /></div>
                         <h4 className="font-black text-slate-900 text-sm">التثبيت</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold">ضع الكود قبل وسم {`</body>`} مباشرة في متجرك.</p>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><Bell size={20} /></div>
                         <h4 className="font-black text-slate-900 text-sm">المعاينة</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-bold">سيظهر جرس أخضر أسفل يمين الصفحة فور حفظ التعديلات.</p>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center mb-6">
                <MousePointerClick size={40} />
              </div>
              <h3 className="font-black text-slate-900 text-xl">اختر متجراً لعرض كود الربط</h3>
              <p className="text-slate-400 max-w-sm mt-3 font-medium">
                بمجرد اختيار متجر، سيظهر لك كود الجافا سكريبت الخاص به لتضمه في موقعك.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal (Simple) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-6">
            <h2 className="text-2xl font-black text-slate-900 text-center">إضافة متجر جديد</h2>
            <input 
              type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)}
              placeholder="مثال: mystore.com"
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-black"
            />
            <div className="flex gap-3">
              <button 
                onClick={handleAddDomain} disabled={isSyncing}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2"
              >
                {isSyncing ? <Loader2 className="animate-spin" /> : 'تأكيد الإضافة'}
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-6 py-4 text-slate-400 font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainsView;
