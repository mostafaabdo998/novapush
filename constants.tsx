
import React from 'react';
import { 
  LayoutDashboard, Send, AppWindow, Code, Settings, Users, 
  Zap, BarChart3, ShieldCheck, Workflow, CreditCard, Activity, Database
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { name: 'لوحة التحكم', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
  { name: 'المواقع والتطبيقات', icon: <AppWindow size={20} />, id: 'apps' },
  { name: 'مركز الحملات', icon: <Send size={20} />, id: 'campaigns' },
  { name: 'الأتمتة الذكية', icon: <Workflow size={20} />, id: 'automation' },
  { name: 'سجلات النظام', icon: <Activity size={20} />, id: 'logs' },
  { name: 'قاعدة الأجهزة', icon: <Database size={20} />, id: 'devices' },
  { name: 'الربط والبرمجة', icon: <Code size={20} />, id: 'integration' },
  { name: 'الاشتراك والفوترة', icon: <CreditCard size={20} />, id: 'billing' },
  { name: 'الإعدادات العامة', icon: <Settings size={20} />, id: 'settings' },
];

export const MOCK_USER = {
  name: 'عبدالرحمن محمد',
  role: 'Enterprise Administrator',
  company: 'PushNova Global Ltd',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
};
