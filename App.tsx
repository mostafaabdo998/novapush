
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import CampaignsView from './views/CampaignsView';
import AppsView from './views/AppsView';
import IntegrationView from './views/IntegrationView';
import LogsView from './views/LogsView';
import BillingView from './views/BillingView';
import { AppProvider } from './store/AppContext';
import { Search, Bell, Command, Settings } from 'lucide-react';
import { MOCK_USER } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'campaigns': return <CampaignsView />;
      case 'apps': return <AppsView />;
      case 'integration': return <IntegrationView />;
      case 'logs': return <LogsView />;
      case 'billing': return <BillingView />;
      default: return <DashboardView />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-[#fcfdfe] flex overflow-hidden" dir="rtl">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 mr-72 h-screen overflow-y-auto custom-scrollbar relative">
          <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 px-10 flex items-center justify-between">
            <div className="flex items-center gap-3 bg-slate-100/50 px-3 py-2 rounded-lg border border-slate-200/60 w-80">
              <Search size={14} className="text-slate-400" />
              <input type="text" placeholder="بحث ذكي... (Cmd+K)" className="bg-transparent border-none focus:outline-none text-[11px] w-full font-medium" />
              <Command size={12} className="text-slate-300" />
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live Gateway: OK</span>
              </div>
              
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                <Bell size={18} />
              </button>

              <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>

              <div className="flex items-center gap-3 pl-2">
                <div className="text-left hidden md:block">
                  <p className="text-[11px] font-bold text-slate-900 leading-none">{MOCK_USER.name}</p>
                  <p className="text-[9px] text-slate-400 mt-1 font-medium">{MOCK_USER.company}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1px]">
                  <img src={MOCK_USER.avatar} alt="User" className="w-full h-full rounded-full border border-white" />
                </div>
              </div>
            </div>
          </header>

          <div className="p-10 max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default App;
