
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Domain {
  id: string;
  url: string;
  type: 'domain' | 'segment'; // التمييز الجديد
  status: 'active' | 'pending';
  subscribers: number;
  createdAt: string;
  publicKey?: string;
}

export interface Campaign {
  id: string;
  title: string;
  message: string;
  url: string;
  sentCount: number;
  clickCount: number;
  status: 'sent' | 'draft' | 'scheduled';
  createdAt: string;
  targetDomains: string[];
}

export interface Stats {
  totalSubscribers: number;
  growth: number;
  countries: { name: string; value: number }[];
  devices: { name: string; value: number }[];
  dailyActive: { date: string; count: number }[];
}
