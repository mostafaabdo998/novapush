
export interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  consumption: {
    messagesSent: number;
    limit: number;
    apiCalls: number;
  };
}

export interface AppInstance {
  id: string;
  name: string;
  url: string;
  projectId: string;
  status: 'active' | 'pending_verification' | 'error';
  platform: {
    web: boolean;
    android: boolean;
    ios: boolean;
  };
  credentials: {
    fcmKey?: string;
    apnsKey?: string;
    safariId?: string;
  };
  subscribersCount: number;
  createdAt: string;
  // Fix: Added missing properties used in AppsView
  plan: 'free' | 'pro' | 'enterprise';
  verificationToken: string;
}

export interface Campaign {
  id: string;
  title: string;
  message: string;
  clickUrl: string;
  imageUrl?: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed';
  scheduledTime?: string;
  stats: {
    sent: number;
    delivered: number;
    clicked: number;
  };
  target: {
    platforms: string[];
    countries: string[];
  };
  // Fix: Added missing property used in CampaignsView
  targetDomains: string[];
  // Fix: Added missing createdAt property used in AppContext
  createdAt: string;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  service: 'FCM' | 'APNs' | 'API' | 'Scheduler';
}

export interface Stats {
  totalSubscribers: number;
  activeLast24h: number;
  avgClickRate: number;
  conversionRate: number;
  growth: number;
  timeline: { date: string; sent: number; clicks: number }[];
  deviceDistribution: { name: string; value: number }[];
  countryDistribution: { name: string; value: number }[];
}