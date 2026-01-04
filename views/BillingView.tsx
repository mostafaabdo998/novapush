
import React, { useEffect, useState } from 'react';
import { CreditCard, Check, Zap, ShieldCheck, Crown, Info, ArrowUpRight } from 'lucide-react';
import { FCMService } from '../services/fcmService';
import { User } from '../types';

const BillingView: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const service = FCMService.getInstance();

  useEffect(() => {
    service.getUser().then(setUser);
  }, []);

  if (!user) return null;

  const plans = [
    { name: 'Free', price: '$0', limit: '10k', icon: <Zap />, features: ['Web Push Only', 'Basic Analytics', '1 Project'] },
    { name: 'Pro', price: '$49', limit: '250k', icon: <ShieldCheck />, features: ['Android & iOS', 'Advanced A/B Testing', '5 Projects', 'API Access'] },
    { name: 'Enterprise', price: '$299', limit: 'Unlimited', icon: <Crown />, features: ['Priority Support', 'Custom Domain', 'Unlimited Projects', 'Dedicated Gateway'] },
  ];

  const consumptionPercent = (user.consumption.messagesSent / user.consumption.limit) * 100;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black text-slate-900">الاشتراك والفوترة</h1>
        <p className="text-slate-500 font-bold mt-1">إدارة خطتك الحالية، مراقبة الاستهلاك، وتحديث طرق الدفع.</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm overflow-hidden relative">
         <div className="absolute top-0 left-0 w-2 h-full bg-blue-600"></div>
         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">خطة {user.plan.toUpperCase()}</span>
                  <span className="text-xs font-bold text-slate-400">تجديد في 12 أبريل 2024</span>
               </div>
               <h2 className="text-2xl font-black text-slate-900">أنت تستخدم باقة الشركات المتقدمة</h2>
               <div className="flex items-center gap-8 pt-4">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">الرسائل المستهلكة</p>
                    <p className="text-xl font-black text-slate-900">{user.consumption.messagesSent.toLocaleString()}</p>
                  </div>
                  <div className="w-[1px] h-10 bg-slate-100"></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">طلبات API</p>
                    <p className="text-xl font-black text-slate-900">{user.consumption.apiCalls.toLocaleString()}</p>
                  </div>
               </div>
            </div>
            <div className="w-full lg:w-96 space-y-4">
               <div className="flex justify-between text-xs font-black">
                  <span className="text-slate-600">سعة الرسائل المجانية</span>
                  <span className="text-blue-600">{Math.round(consumptionPercent)}%</span>
               </div>
               <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${consumptionPercent}%` }}></div>
               </div>
               <p className="text-[10px] text-slate-400 font-bold">بقي لك {(user.consumption.limit - user.consumption.messagesSent).toLocaleString()} رسالة هذا الشهر.</p>
            </div>
         </div>
      </div>

      {/* Plans Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {plans.map((p, i) => (
           <div key={i} className={`bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col group hover:shadow-2xl transition-all duration-500 ${user.plan.toLowerCase() === p.name.toLowerCase() ? 'ring-4 ring-blue-600/10' : ''}`}>
              <div className={`p-4 rounded-2xl w-fit mb-8 ${user.plan.toLowerCase() === p.name.toLowerCase() ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
                 {p.icon}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{p.name}</h3>
              <div className="flex items-baseline gap-1 mb-8">
                 <span className="text-3xl font-black text-slate-900">{p.price}</span>
                 <span className="text-xs font-bold text-slate-400">/شهرياً</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                 {p.features.map((f, j) => (
                   <li key={j} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                      <Check size={14} className="text-emerald-500" />
                      {f}
                   </li>
                 ))}
              </ul>
              <button className={`w-full py-4 rounded-2xl font-black text-xs transition-all ${
                user.plan.toLowerCase() === p.name.toLowerCase() 
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20'
              }`}>
                {user.plan.toLowerCase() === p.name.toLowerCase() ? 'خُطتك الحالية' : 'ترقية الآن'}
              </button>
           </div>
         ))}
      </div>
    </div>
  );
};

export default BillingView;
