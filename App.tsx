
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './views/DashboardView';
import CampaignsView from './views/CampaignsView';
import DomainsView from './views/DomainsView';
import { Search, Bell, User } from 'lucide-react';
import { MOCK_USER } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'campaigns': return <CampaignsView />;
      case 'domains': return <DomainsView />;
      case 'settings': return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center">
            <User size={40} />
          </div>
          <h2 className="text-xl font-bold text-slate-400">صفحة الإعدادات قيد التطوير</h2>
          <p className="text-slate-400">قريباً: إدارة ملفك الشخصي وخطط الاشتراك.</p>
        </div>
      );
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex" dir="rtl">
      {/* Sidebar - Fixed on the right */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content - Offset by sidebar width */}
      <main className="flex-1 mr-64 transition-all duration-300 min-h-screen">
        {/* Top Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-xl w-96">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="ابحث عن حملات، نطاقات، أو مشتركين..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-slate-400 hover:text-blue-600 transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900 leading-none">{MOCK_USER.name}</p>
                <p className="text-xs text-slate-400 mt-1">الخطة الاحترافية</p>
              </div>
              <img 
                src={MOCK_USER.avatar} 
                alt="Profile" 
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
              />
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
