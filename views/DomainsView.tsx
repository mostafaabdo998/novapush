
import React, { useEffect, useState } from 'react';
import { LaraPushService } from '../services/laraPushService';
import { Domain } from '../types';
import { Globe, Plus, Copy, Download, Loader2, Tags, ShieldAlert, Code2, MousePointerClick, Layout, Monitor, Smartphone, Check, HelpCircle, Info } from 'lucide-react';

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
      alert("✅ تم إعداد " + (linkType === 'domain' ? "النطاق المستقل" : "الربط السريع") + " بنجاح!");
    } catch (err: any) {
      alert("⚠️ حدث خطأ أثناء الإعداد، يرجى المحاولة لاحقاً.");
    } finally {
      setIsSyncing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم نسخ كود التفعيل بنجاح! ضعه الآن في متجرك.');
  };

  const getIntegrationCode = () => {
    if (!selectedDomain) return '';
    
    if (selectedDomain.type === 'segment') {
      // الكود الجديد الذي ينسخه المسوق ويضعه في موقعه (SaaS Mode)
      return `<script>
(function() {
  var btn = document.createElement("div");
  btn.innerHTML = "🔔"; 
  btn.style = "position:fixed; bottom:25px; right:25px; width:60px; height:60px; background:#28a745; color:white; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:28px; cursor:pointer; z-index:999999; box-shadow:0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s ease;";
  btn.onmouseover = function() { this.style.transform = "scale(1.1)"; };
  btn.onmouseout = function() { this.style.transform = "scale(1)"; };
  document.body.appendChild(btn);

  btn.onclick = function() {
    var width = 450, height = 550;
    var left = (screen.width/2)-(width/2);
    var top = (screen.height/2)-(height/2);
    // الرابط الجديد يشير إلى صفحة ووردبريس subscribe-nova
    var subscribeUrl = "https://nbdmasr.com/subscribe-nova/?client_id=" + window.location.hostname;
    window.open(subscribeUrl, "PushNova", "width="+width+",height="+height+",top="+top+",left="+left);
  };
})();
</script>`;
    } else {
      // كود الربط المباشر للنطاقات المستقلة (Native Mode)
      return `<!-- PushNova Native Integration (Independent Domain) -->
<script src="https://push.nbdmasr.com/larapush.js"></script>
<script>
  PushNova.init({
    domain: "${selectedDomain.url}"
  });
</script>`;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">إدارة المتاجر المربوطة</h1>
          <p className="text-slate-500 font-medium">تحكم في كيفية ظهور الإشعارات وربطها بمواقع عملائك.</p>
        </div>
        <button 
          onClick={() => { setShowAddModal(true); setNewUrl(''); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          إضافة متجر جديد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">المتاجر المسجلة</h3>
          {domains.length === 0 ? (
            <div className="p-10 bg-white rounded-3xl border-2 border-dashed border-slate-100 text-center">
               <Globe size={40} className="mx-auto text-slate-200 mb-3" />
               <p className="text-sm text-slate-400 font-bold">لا توجد متاجر حالياً</p>
            </div>
          ) : (
            domains.map((domain) => (
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
                  <div className={`p-3 rounded-2xl ${selectedDomain?.id === domain.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                    {domain.type === 'domain' ? <Globe size={24} /> : <Tags size={24} />}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                    domain.type === 'domain' 
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                      : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  }`}>
                    {domain.type === 'domain' ? 'نطاق مستقل' : 'ربط سريع (SaaS)'}
                  </span>
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
        <div className="lg:col-span-2">
          {selectedDomain ? (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden animate-in slide-in-from-left-4">
              <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedDomain.url}</h2>
                  <p className="text-slate-500 font-medium">نظام الربط: {selectedDomain.type === 'domain' ? 'Native Mode' : 'Smart Pop-up'}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 text-[10px] font-black">
                  <Check size={14} /> متصل بنجاح
                </div>
              </div>
              
              <div className="p-10 space-y-10">
                {selectedDomain.type === 'segment' && (
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4">
                    <div className="p-2 bg-blue-600 text-white rounded-lg"><Info size={20} /></div>
                    <div>
                       <h4 className="font-black text-blue-900 text-sm">ميزة الربط السريع النشطة</h4>
                       <p className="text-blue-800/70 text-[11px] font-bold leading-relaxed mt-1">
                         يتم توجيه المشتركين عبر الدومين المركزي <span className="underline">nbdmasr.com</span> لضمان تجاوز قيود المتصفحات على المنصات المشتركة.
                       </p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                      <Code2 className="text-blue-600" />
                      كود تفعيل الإشعارات في المتجر
                    </h3>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">JavaScript</span>
                  </div>
                  
                  <div className="relative group">
                    <pre className="bg-slate-900 text-blue-300 p-8 rounded-[2rem] text-[11px] font-mono overflow-x-auto ltr text-left leading-relaxed border-4 border-slate-800 shadow-xl">
                      {getIntegrationCode()}
                    </pre>
                    <button 
                      onClick={() => copyToClipboard(getIntegrationCode())}
                      className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                      <Copy size={18} />
                      نسخ الكود
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:border-blue-600 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl"><Layout size={24} /></div>
                       <h4 className="font-black text-slate-900">أين تضع الكود؟</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold">
                      انسخ الكود أعلاه وضعه في قسم <span className="text-blue-600">Head</span> أو <span className="text-blue-600">أكواد التتبع</span> في إعدادات متجرك.
                    </p>
                  </div>
                  
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:border-blue-600 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Monitor size={24} /></div>
                       <h4 className="font-black text-slate-900">كيف تختبر العمل؟</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold">
                      افتح المتجر من متصفح خفي، سيظهر جرس الإشعارات أسفل الصفحة. اضغط عليه لتفعيل الاشتراك.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[550px] bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-blue-50 text-blue-200 rounded-full flex items-center justify-center mb-6">
                <MousePointerClick size={48} />
              </div>
              <h3 className="font-black text-slate-900 text-xl">اختر متجراً لمتابعة الإعدادات</h3>
              <p className="text-slate-400 max-w-sm mt-3 font-medium leading-relaxed">
                ستظهر هنا تعليمات الربط وكود التفعيل الخاص بكل متجر حسب نوعه.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Store Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900">إضافة متجر جديد</h2>
              <p className="text-slate-500 font-bold">سيتم إعداد نظام الربط الأنسب لمتجرك</p>
            </div>
            
            <form onSubmit={handleAddDomain} className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-800 block mr-2 tracking-wide">رابط المتجر (أو اسم تعريفي)</label>
                <div className="relative group">
                  <Globe className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="text" required value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="mystore.com"
                    className="w-full pr-14 pl-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-black shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-black text-slate-800 block mr-2">نوع الموقع أو المنصة</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => setLinkType('segment')}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      linkType === 'segment' 
                        ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-500/10' 
                        : 'border-slate-50 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <Layout size={20} className={linkType === 'segment' ? 'text-blue-600' : ''} />
                    <span className={`text-[11px] font-black ${linkType === 'segment' ? 'text-blue-900' : ''}`}>منصة (سلة/Easy)</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setLinkType('domain')}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                      linkType === 'domain' 
                        ? 'border-blue-600 bg-blue-50 shadow-lg shadow-blue-500/10' 
                        : 'border-slate-50 bg-slate-50 text-slate-400'
                    }`}
                  >
                    <Globe size={20} className={linkType === 'domain' ? 'text-blue-600' : ''} />
                    <span className={`text-[11px] font-black ${linkType === 'domain' ? 'text-blue-900' : ''}`}>نطاق مستقل</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" disabled={isSyncing}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSyncing ? <Loader2 className="animate-spin" size={20} /> : 'تأكيد الإعداد'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-4 text-slate-400 font-black hover:bg-slate-50 rounded-2xl transition-all">تراجع</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainsView;
