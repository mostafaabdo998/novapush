
import React, { useState } from 'react';
import { Code, Copy, Terminal, CheckCircle2, ShieldCheck, Cpu, Info, Zap } from 'lucide-react';

const IntegrationView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const swCode = `// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  projectId: "YOUR_PROJECT_ID",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});`;

  const initCode = `// Client Side Integration
const messaging = getMessaging(app);
getToken(messaging, { vapidKey: 'YOUR_VAPID_PUBLIC_KEY' }).then((currentToken) => {
  if (currentToken) {
    // إرسال الـ Token لخادم PushNova لتخزينه
    fetch('https://api.pushnova.io/v1/subscribers', {
      method: 'POST',
      body: JSON.stringify({ token: currentToken })
    });
  }
});`;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900">دليل ربط النظام (SDK)</h1>
        <p className="text-slate-500 font-medium mt-1">خطوات بسيطة لدمج إشعارات PushNova في موقعك الإلكتروني.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1 */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">1</div>
               <h3 className="text-2xl font-black text-slate-900">إعداد Service Worker</h3>
             </div>
             <p className="text-slate-600 mb-6 font-medium leading-relaxed">قم بإنشاء ملف باسم <code className="bg-slate-100 px-2 py-1 rounded text-blue-600 font-bold">firebase-messaging-sw.js</code> في المجلد الرئيسي لموقعك (Root Folder).</p>
             
             <div className="relative group">
                <pre className="bg-slate-900 text-blue-300 p-8 rounded-3xl text-[11px] font-mono overflow-x-auto ltr text-left leading-relaxed">
                  {swCode}
                </pre>
                <button 
                  onClick={() => copy(swCode)}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all"
                >
                  <Copy size={18} />
                </button>
             </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 shadow-sm">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">2</div>
               <h3 className="text-2xl font-black text-slate-900">طلب الإذن والحصول على Token</h3>
             </div>
             <p className="text-slate-600 mb-6 font-medium leading-relaxed">أضف هذا الكود في واجهة موقعك لطلب إذن الإشعارات من الزوار.</p>
             
             <div className="relative group">
                <pre className="bg-slate-900 text-blue-300 p-8 rounded-3xl text-[11px] font-mono overflow-x-auto ltr text-left leading-relaxed">
                  {initCode}
                </pre>
                <button 
                  onClick={() => copy(initCode)}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all"
                >
                  <Copy size={18} />
                </button>
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-500/40">
              <ShieldCheck size={48} className="mb-6 opacity-80" />
              <h4 className="text-xl font-black mb-4">لماذا نستخدم Firebase؟</h4>
              <ul className="space-y-4 text-blue-100 font-bold text-sm">
                <li className="flex items-start gap-3">
                   <CheckCircle2 size={18} className="text-white mt-1 shrink-0" />
                   <span>تجاوز قيود المتصفحات الحديثة في استلام الرسائل.</span>
                </li>
                <li className="flex items-start gap-3">
                   <CheckCircle2 size={18} className="text-white mt-1 shrink-0" />
                   <span>دعم كامل لأجهزة الأندرويد والآيفون (عبر الويب).</span>
                </li>
                <li className="flex items-start gap-3">
                   <CheckCircle2 size={18} className="text-white mt-1 shrink-0" />
                   <span>أمان عالي عبر مفاتيح VAPID المشفرة.</span>
                </li>
              </ul>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-slate-900">
                 <Zap className="text-amber-500" size={24} />
                 <h4 className="font-black">روابط سريعة</h4>
              </div>
              <div className="space-y-3">
                 <a href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
                    <span className="text-xs font-black text-slate-700">توثيق الـ Rest API</span>
                    <Terminal size={14} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                 </a>
                 <a href="#" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group">
                    <span className="text-xs font-black text-slate-700">تحميل ملف الـ SDK</span>
                    <Cpu size={14} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                 </a>
              </div>
           </div>

           <div className="p-6 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center text-center">
              <Info className="text-slate-300 mb-2" />
              <p className="text-[10px] text-slate-400 font-bold">تحتاج لمساعدة؟ تواصل مع فريق الدعم التقني عبر الشات المباشر.</p>
           </div>
        </div>
      </div>

      {copied && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-2xl animate-in fade-in slide-in-from-bottom-5">
           ✅ تم نسخ الكود بنجاح!
        </div>
      )}
    </div>
  );
};

export default IntegrationView;
