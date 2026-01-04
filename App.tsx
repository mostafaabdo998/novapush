
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import CampaignsView from './views/CampaignsView';
import AppsView from './views/AppsView';
import IntegrationView from './views/IntegrationView';
import AutomationView from './views/AutomationView';
import { Search, Bell, Globe, Sparkles } from 'lucide-react';
import { MOCK_USER } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'campaigns': return <CampaignsView />;
      case 'apps': return <AppsView />;
      case 'integration': return <IntegrationView />;
      case 'automation': return <AutomationView />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
           <Sparkles size={48} className="mb-4 opacity-20" />
           <p className="font-bold">هذا القسم متاح في النسخة الـ Enterprise فقط</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden" dir="rtl">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 mr-72 transition-all duration-300 h-screen overflow-y-auto custom-scrollbar">
        {/* Top Navigation */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 px-10 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 w-80">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="بحث سريع..." className="bg-transparent border-none focus:outline-none text-xs w-full font-medium" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
              <Globe size={14} />
              FCM Edge Nodes: Active
            </div>
            
            <button className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-left">
                <p className="text-xs font-black text-slate-900 leading-none">{MOCK_USER.name}</p>
                <p className="text-[10px] text-slate-400 mt-1 font-bold">{MOCK_USER.company}</p>
              </div>
              <img src={MOCK_USER.avatar} alt="User" className="w-10 h-10 rounded-xl shadow-lg border-2 border-white group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
