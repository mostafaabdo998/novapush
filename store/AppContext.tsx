
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AppInstance, Campaign, SystemLog } from '../types';

interface AppContextType {
  user: User;
  apps: AppInstance[];
  campaigns: Campaign[];
  logs: SystemLog[];
  addApp: (app: Partial<AppInstance>) => void;
  sendNotification: (campaign: Partial<Campaign>) => Promise<boolean>;
  deleteApp: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({
    id: 'u_1',
    name: 'عبدالرحمن محمد',
    email: 'admin@pushnova.io',
    plan: 'enterprise',
    consumption: { messagesSent: 850400, limit: 1000000, apiCalls: 45200 }
  });

  const [apps, setApps] = useState<AppInstance[]>([
    {
      id: 'app_001',
      name: 'متجر سلة المتقدم',
      url: 'salla-store.com',
      projectId: 'salla-prod-99',
      status: 'active',
      platform: { web: true, android: true, ios: true },
      credentials: { fcmKey: 'AIzaSy...', apnsKey: 'AuthKey_T8...' },
      subscribersCount: 125400,
      createdAt: '2023-10-12',
      plan: 'enterprise',
      verificationToken: 'v_token_8822'
    }
  ]);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);

  const addApp = (newAppData: Partial<AppInstance>) => {
    const app: AppInstance = {
      id: `app_${Date.now()}`,
      name: newAppData.name || 'موقع جديد',
      url: newAppData.url || 'domain.com',
      projectId: newAppData.projectId || 'project-id',
      status: 'pending_verification',
      platform: { web: true, android: false, ios: false },
      credentials: {},
      subscribersCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      plan: 'free',
      verificationToken: `v_token_${Math.random().toString(36).substr(2, 5)}`
    };
    setApps([...apps, app]);
    addLog('API', `تمت إضافة مشروع جديد: ${app.name}`, 'info');
  };

  const deleteApp = (id: string) => {
    setApps(apps.filter(a => a.id !== id));
    addLog('API', `تم حذف المشروع بنجاح`, 'warning');
  };

  const addLog = (service: SystemLog['service'], message: string, level: SystemLog['level']) => {
    const log: SystemLog = {
      id: `log_${Date.now()}`,
      service,
      message,
      level,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [log, ...prev].slice(0, 50));
  };

  const sendNotification = async (campData: Partial<Campaign>) => {
    // محاكاة عملية الباك إند
    const newCampaign: Campaign = {
      id: `c_${Date.now()}`,
      title: campData.title || '',
      message: campData.message || '',
      clickUrl: campData.clickUrl || '',
      status: 'completed',
      stats: { sent: 125400, delivered: 124800, clicked: 0 },
      target: { platforms: ['web'], countries: ['KSA'] },
      targetDomains: campData.targetDomains || [],
      createdAt: new Date().toISOString()
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setUser(prev => ({
      ...prev,
      consumption: {
        ...prev.consumption,
        messagesSent: prev.consumption.messagesSent + 125400
      }
    }));
    addLog('FCM', `تم إرسال حملة "${newCampaign.title}" بنجاح`, 'info');
    return true;
  };

  return (
    <AppContext.Provider value={{ user, apps, campaigns, logs, addApp, sendNotification, deleteApp }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
