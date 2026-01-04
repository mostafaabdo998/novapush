
import React from 'react';
import { 
  LayoutDashboard, 
  Send, 
  AppWindow, 
  Code, 
  Settings, 
  Users, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Layers,
  Workflow
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { name: 'نظرة عامة', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
  { name: 'إدارة المواقع', icon: <AppWindow size={20} />, id: 'apps' },
  { name: 'مركز الإرسال', icon: <Send size={20} />, id: 'campaigns' },
  { name: 'الأتمتة الذكية', icon: <Workflow size={20} />, id: 'automation' },
  { name: 'تحليلات عميقة', icon: <BarChart3 size={20} />, id: 'analytics' },
  { name: 'إدارة الجمهور', icon: <Users size={20} />, id: 'subscribers' },
  { name: 'أدوات المطورين', icon: <Code size={20} />, id: 'integration' },
  { name: 'الإعدادات', icon: <Settings size={20} />, id: 'settings' },
];

export const MOCK_USER = {
  name: 'عبدالرحمن محمد',
  role: 'مدير العمليات',
  company: 'Global Retail Group',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
};
