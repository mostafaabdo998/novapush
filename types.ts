
export interface AppInstance {
  id: string;
  name: string;
  url: string;
  projectId: string;
  apiKey: string;
  messagingSenderId: string;
  vapidKey: string;
  status: 'active' | 'pending_verification' | 'disabled';
  verificationToken: string;
  subscribersCount: number;
  createdAt: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface Campaign {
  id: string;
  title: string;
  message: string;
  clickUrl: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed';
  stats: {
    sent: number;
    delivered: number;
    clicked: number;
  };
  targetType: 'all' | 'segment' | 'individual';
  appId: string;
  createdAt: string;
  // Added properties used in CampaignsView.tsx
  targetDomains: string[];
  sentCount?: number;
}

export interface Workflow {
  id: string;
  name: string;
  trigger: 'on_subscribe' | 'on_click' | 'inactivity';
  action: 'send_notification';
  delay: string;
  isActive: boolean;
}

export interface Stats {
  totalSubscribers: number;
  activeLast24h: number;
  avgClickRate: number;
  conversionRate: number;
  countryDistribution: { name: string; value: number }[];
  deviceDistribution: { name: string; value: number }[];
  timeline: { date: string; clicks: number; sent: number }[];
}