
import React, { useEffect, useState } from 'react';
import { LaraPushService } from '../services/laraPushService';
import { Domain } from '../types';
import { Globe, Plus, CheckCircle, Clock, Copy, Download, FileCode, ShieldAlert, Terminal } from 'lucide-react';

const DomainsView: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [newUrl, setNewUrl] = useState('');
  
  const service = LaraPushService.getInstance();

  useEffect(() => {
    service.getDomains().then(setDomains);
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    const added = await service.addDomain(newUrl);
    setDomains([...domains, added]);
    setNewUrl('');
    setShowAddModal(false);
    setSelectedDomain(added);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('تم النسخ بنجاح');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">إدارة المواقع</h1>
          <p className="text-slate-500">قم بربط متاجر عملائك بمحرك PushNova المركزي.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          إضافة موقع عميل
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
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
                  <Globe size={24} />
                </div>
                <span className={`text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 ${
                  domain.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {domain.status === 'active' ? <CheckCircle size={12} /> : <Clock size={12} />}
                  {domain.status === 'active' ? 'نشط ومربوط' : 'بانتظار الربط'}
                </span>
              </div>
              <h3 className="font-black text-slate-900 text-lg">{domain.url}</h3>
              <div className="flex items-center justify-between mt-4">
                 <span className="text-xs text-slate-400">إجمالي المشتركين</span>
                 <span className="text-sm font-bold text-blue-600">{domain.subscribers.toLocaleString()}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2">
          {selectedDomain ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
              <div className="p-10 border-b border-slate-50 bg-gradient-to-l from-slate-50 to-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">دليل الربط لـ {selectedDomain.url}</h2>
                  <p className="text-slate-500 mt-2 font-medium">اتبع الخطوات بدقة لضمان قراءة قاعدة البيانات للمشتركين.</p>
                </div>
              </div>
              
              <div className="p-10 space-y-12">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/30">1</div>
                    <h3 className="font-black text-slate-900 text-lg">رفع ملفات المحرك (Root Files)</h3>
                  </div>
                  <div className="pr-14 space-y-4">
                    <p className="text-slate-600 leading-relaxed text-sm">
                      يجب تحميل هذه الملفات ورفعها إلى المجلد الرئيسي لموقع العميل (public_html). هذه الملفات هي التي تمكن LaraPush من العمل تحت دومين العميل.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-50 bg-slate-50/30 hover:bg-white hover:border-blue-600 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                             <Download size={20} />
                           </div>
                           <div className="text-right">
                             <span className="block text-sm font-black text-slate-800">manifest.json</span>
                             <span className="text-[10px] text-slate-400">تكوين المتصفح</span>
                           </div>
                        </div>
                      </button>
                      <button className="flex items-center justify-between p-5 rounded-2xl border-2 border-slate-50 bg-slate-50/30 hover:bg-white hover:border-blue-600 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                             <Download size={20} />
                           </div>
                           <div className="text-right">
                             <span className="block text-sm font-black text-slate-800">service-worker.js</span>
                             <span className="text-[10px] text-slate-400">مشغل الإشعارات</span>
                           </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-blue-500/30">2</div>
                    <h3 className="font-black text-slate-900 text-lg">تثبيت كود التتبع (Pixel JS)</h3>
                  </div>
                  <div className="pr-14 space-y-4">
                    <p className="text-slate-600 leading-relaxed text-sm">
                      انسخ الكود التالي وضعه قبل إغلاق وسم <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-600 font-bold font-mono text-xs">&lt;/head&gt;</code>.
                    </p>
                    <div className="relative group">
                      <div className="absolute -top-3 right-5 px-3 py-1 bg-slate-800 text-white text-[10px] font-black rounded-lg flex items-center gap-2">
                        <Terminal size={12} />
                        CLIENT_SDK_V2
                      </div>
                      <pre className="bg-slate-900 text-blue-400 p-8 rounded-[2rem] text-[11px] font-mono overflow-x-auto leading-relaxed border-4 border-slate-800 shadow-2xl">
{`<!-- PushNova SaaS Integration -->
<script src="https://pushnova.com/sdk/${selectedDomain.id}.js" async></script>
<script>
  PushNova.init({
    appId: "${selectedDomain.id}",
    domain: "${selectedDomain.url}",
    publicKey: "${selectedDomain.publicKey}",
    engine: "larapush_v2"
  });
</script>`}
                      </pre>
                      <button 
                        onClick={() => copyToClipboard(`<script src="https://pushnova.com/sdk/${selectedDomain.id}.js"></script>`)}
                        className="absolute top-6 left-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md"
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50 p-8 rounded-[2rem] border-2 border-rose-100 flex gap-5 pr-14 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-full -mr-16 -mt-16"></div>
                  <div className="text-rose-600 flex-shrink-0 z-10">
                    <ShieldAlert size={32} />
                  </div>
                  <div className="z-10">
                    <h4 className="font-black text-rose-900 text-md">سياسة الخصوصية والأمان</h4>
                    <p className="text-rose-800/70 text-xs mt-2 leading-relaxed font-medium">
                      هذا الكود مخصص حصرياً للنطاق <span className="font-black underline">{selectedDomain.url}</span>. 
                      سيقوم النظام برفض أي اشتراك يأتي من نطاقات غير مسجلة حمايةً لبياناتك ومنعاً للتلاعب بمشتركيك.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] bg-white rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6">
                <Globe size={48} />
              </div>
              <h3 className="font-black text-slate-900 text-xl">بانتظار اختيار موقع</h3>
              <p className="text-slate-400 max-w-sm mt-3 font-medium">اختر أحد مواقع عملائك من القائمة اليمنى لعرض ملفات الربط والتحقق من حالة الاتصال بقاعدة البيانات.</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-slate-900">موقع عميل جديد</h2>
              <p className="text-slate-500 font-medium">سيتم إنشاء سجل جديد في جدول lp_db.domains</p>
            </div>
            <form onSubmit={handleAddDomain} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-black text-slate-700 block mr-2">رابط المتجر (بدون https)</label>
                <div className="relative">
                  <Globe className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="myshop.com"
                    className="w-full pr-14 pl-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-600 focus:outline-none font-bold placeholder:text-slate-300 transition-all shadow-sm"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-500/30 transition-all active:scale-95"
                >
                  تأكيد الإضافة
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-8 py-4 text-slate-400 font-black hover:bg-slate-50 rounded-2xl transition-all"
                >
                  تراجع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainsView;
