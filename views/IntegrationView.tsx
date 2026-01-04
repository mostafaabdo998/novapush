
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Code, Terminal, Server, Key, Copy, CheckCircle, ChevronRight, Zap } from 'lucide-react';

const IntegrationView: React.FC = () => {
  const { apps } = useApp();
  const [activeTab, setActiveTab] = useState<'sdk' | 'api'>('api');
  const [copied, setCopied] = useState(false);

  const apiDoc = `// إرسال إشعار عبر API الباك إند الخاص بك
const response = await fetch('https://api.pushnova.io/v1/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_SECRET_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "خصم حصري!",
    message: "استخدم الكود NOV20 للحصول على خصم 20%",
    url: "https://yourstore.com/offers",
    target: { segment: "premium_users" }
  })
});

const data = await response.json();
console.log('Push ID:', data.id);`;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-10 animate-float">
          <Zap size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-extrabold font-jakarta mb-4">ما هو نظام الـ API وكيف تستخدمه؟</h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            الـ **API** هو الجسر البرمجي الذي يسمح لنظامك (مثل متجرك في سلة أو موقعك الخاص) بالتحدث مع منصة **PushNova**. 
            بدلاً من الدخول للوحة التحكم يدوياً لإرسال كل إشعار، يمكنك جعل الباك إند الخاص بك يرسل الإشعارات تلقائياً عند وقوع أحداث معينة (مثل إتمام طلب جديد).
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('api')}
              className={`px-6 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === 'api' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
            >
              استخدام REST API
            </button>
            <button 
              onClick={() => setActiveTab('sdk')}
              className={`px-6 py-3 rounded-xl font-bold text-xs transition-all ${activeTab === 'sdk' ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'}`}
            >
              تثبيت الـ SDK (Web)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Terminal size={20} className="text-blue-600" />
                <h3 className="font-bold text-slate-900">مثال على الطلب (Payload)</h3>
              </div>
              <button 
                onClick={() => copy(apiDoc)}
                className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                {copied ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                نسخ الكود
              </button>
            </div>
            <pre className="bg-slate-900 rounded-xl p-6 text-[11px] font-mono text-blue-300 ltr text-left overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
              {apiDoc}
            </pre>
          </div>
        </div>

        <div className="space-y-6">
           <div className="glass-card rounded-2xl p-8 border-r-4 border-r-blue-600">
              <Key size={32} className="text-blue-600 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">مفاتيح الوصول (API Keys)</h4>
              <p className="text-xs text-slate-500 mb-6 font-medium">استخدم هذا المفتاح في ترويسة الـ Authorization الخاصة بك.</p>
              <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex items-center justify-between group">
                 <code className="text-[10px] font-mono font-bold text-slate-600 truncate">nova_live_8x22y9z...</code>
                 <button className="text-slate-400 group-hover:text-blue-600"><Copy size={14} /></button>
              </div>
           </div>

           <div className="glass-card rounded-2xl p-8 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-4 text-sm">مراحل التنفيذ:</h4>
              <div className="space-y-4">
                 {[
                   { t: 'تثبيت الـ Service Worker', s: 'done' },
                   { t: 'الحصول على توكن المشترك', s: 'done' },
                   { t: 'الربط مع API الإرسال', s: 'pending' }
                 ].map((step, i) => (
                   <div key={i} className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-600">{step.t}</span>
                      {step.s === 'done' ? <CheckCircle size={14} className="text-emerald-500" /> : <ChevronRight size={14} className="text-slate-300" />}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationView;
