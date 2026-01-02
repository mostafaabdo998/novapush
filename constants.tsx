
import React from 'react';
import { LayoutDashboard, Send, Globe, Settings, LogOut, Plus, Bell, ShieldCheck, Users, BarChart3 } from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { name: 'نظرة عامة', icon: <LayoutDashboard size={20} />, id: 'dashboard' },
  { name: 'الحملات', icon: <Send size={20} />, id: 'campaigns' },
  { name: 'النطاقات (Domains)', icon: <Globe size={20} />, id: 'domains' },
  { name: 'الإعدادات', icon: <Settings size={20} />, id: 'settings' },
];

export const MOCK_USER: any = {
  id: 'user_1',
  name: 'أحمد المحمد',
  email: 'ahmed@example.com',
  avatar: 'https://picsum.photos/seed/ahmed/100/100'
};
