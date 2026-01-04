
import { AppInstance, Campaign, Stats, SystemLog, User } from '../types';

export class FCMService {
  private static instance: FCMService;
  
  static getInstance() {
    if (!this.instance) this.instance = new FCMService();
    return this.instance;
  }

  private user: User = {
    id: 'u_1',
    name: 'عبدالرحمن محمد',
    email: 'admin@enterprise.com',
    plan: 'enterprise',
    consumption: {
      messagesSent: 850400,
      limit: 1000000,
      apiCalls: 45200
    }
  };

  private apps: AppInstance[] = [
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
      verificationToken: 'pushnova_v_token_abc123'
    }
  ];

  private campaigns: Campaign[] = [
    {
      id: 'c1',
      title: 'خصومات شهر رمضان',
      message: 'استمتع بخصم 50% على كافة المنتجات بمناسبة الشهر الفضيل',
      clickUrl: 'https://salla-store.com/ramadan',
      status: 'completed',
      stats: { sent: 125000, delivered: 124800, clicked: 18500 },
      target: { platforms: ['web', 'android'], countries: ['KSA', 'UAE'] },
      targetDomains: ['salla-store.com'],
      // Fix: Added missing createdAt property to satisfy Campaign interface
      createdAt: '2023-10-12'
    }
  ];

  private logs: SystemLog[] = [
    { id: 'l1', level: 'info', message: 'تمت مزامنة 450 جهاز جديد بنجاح', timestamp: new Date().toISOString(), service: 'FCM' },
    { id: 'l2', level: 'error', message: 'فشل تسليم إشعار لـ 12 جهاز (Invalid Token)', timestamp: new Date().toISOString(), service: 'APNs' },
    { id: 'l3', level: 'warning', message: 'ارتفاع معدل الطلبات على API Gateway', timestamp: new Date().toISOString(), service: 'API' }
  ];

  private workflows = [
    { id: 'w1', name: 'الترحيب بالمشتركين الجدد', trigger: 'on_subscribe', delay: '0', isActive: true },
    { id: 'w2', name: 'تنبيه السلة المهجورة', trigger: 'on_click', delay: '15m', isActive: true },
    { id: 'w3', name: 'إعادة التنشيط', trigger: 'inactivity', delay: '7d', isActive: false }
  ];

  async getUser() { return this.user; }
  async getApps() { return this.apps; }
  async getLogs() { return this.logs; }

  // Fix: Added missing getCampaigns method
  async getCampaigns() { return this.campaigns; }

  // Fix: Added missing sendFCMNotification method
  async sendFCMNotification(data: any): Promise<boolean> {
    console.log("FCM V1 Gateway: Sending notification payload...", data);
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  }

  // Fix: Added missing verifyDomain method
  async verifyDomain(id: string): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        const app = this.apps.find(a => a.id === id);
        if (app) app.status = 'active';
        resolve(true);
      }, 1200);
    });
  }

  // Fix: Added missing getWorkflows method
  async getWorkflows() { return this.workflows; }

  async getStats(appId: string): Promise<Stats> {
    return {
      totalSubscribers: 125400,
      activeLast24h: 32400,
      avgClickRate: 14.8,
      conversionRate: 4.2,
      growth: 12.5,
      timeline: Array.from({ length: 15 }, (_, i) => ({
        date: `${i + 1} Mar`,
        sent: Math.floor(Math.random() * 5000) + 10000,
        clicks: Math.floor(Math.random() * 2000) + 500
      })),
      deviceDistribution: [
        { name: 'Android', value: 65 }, { name: 'iOS', value: 25 }, { name: 'Web', value: 10 }
      ],
      countryDistribution: [
        { name: 'KSA', value: 45 }, { name: 'UAE', value: 30 }, { name: 'Egypt', value: 25 }
      ]
    };
  }

  async sendCampaign(data: any): Promise<boolean> {
    console.log("Gateway: Routing to FCM/APNs Cluster...", data);
    return true;
  }
}