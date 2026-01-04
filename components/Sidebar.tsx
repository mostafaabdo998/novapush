
import React from 'react';
import { NAVIGATION_ITEMS } from '../constants';
import { LogOut, Zap, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="w-72 h-full bg-[#0f172a] text-white flex flex-col fixed right-0 top-0 z-50 shadow-2xl">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/30">
          <Zap size={24} className="text-white fill-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight leading-none">PushNova</span>
          <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase mt-1">Infrastructure</span>
        </div>
      </div>

      <div className="px-6 mb-8">
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
            <ShieldCheck size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase">FCM Protection</span>
            <span className="text-xs font-bold text-emerald-400">Enterprise Shield</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {NAVIGATION_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <span className={`transition-transform duration-300 group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-500'}`}>
              {item.icon}
            </span>
            <span className="font-bold text-sm">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 p-5 rounded-3xl border border-blue-500/20 mb-6">
           <p className="text-[10px] font-black text-blue-400 uppercase mb-2">النظام الحالي</p>
           <h4 className="text-sm font-black text-white">خطة Enterprise</h4>
           <div className="mt-4 bg-slate-900/50 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-500 h-full w-[85%] rounded-full"></div>
           </div>
           <p className="text-[9px] text-slate-400 mt-2 font-bold">850k / 1M إشعار متبقي</p>
        </div>
        
        <button className="w-full flex items-center gap-3 px-5 py-4 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-2xl transition-all font-bold text-sm">
          <LogOut size={18} />
          <span>إنهاء الجلسة</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
