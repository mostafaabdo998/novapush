
import { AppInstance, Campaign, Stats, Workflow } from '../types';

export class FCMService {
  private static instance: FCMService;
  
  static getInstance() {
    if (!this.instance) this.instance = new FCMService();
    return this.instance;
  }

  private apps: AppInstance[] = [
    {
      id: 'app_ent_01',
      name: 'منصة تسوق العالمية',
      url: 'global-mall.com',
      projectId: 'gm-production-fcm',
      apiKey: 'AIzaSy...',
      messagingSenderId: '77889900',
      vapidKey: 'BDj_mK...',
      status: 'active',
      verificationToken: 'pushnova-v-8x22y',
      subscribersCount: 84200,
      createdAt: '2023-11-01',
      plan: 'enterprise'
    }
  ];

  private workflows: Workflow[] = [
    { id: 'w_1', name: 'ترحيب المشتركين الجدد', trigger: 'on_subscribe', action: 'send_notification', delay: '0', isActive: true },
    { id: 'w_2', name: 'تذكير السلة المتروكة', trigger: 'on_click', action: 'send_notification', delay: '24h', isActive: false }
  ];

  // Mock campaigns data
  private campaigns: Campaign[] = [
    {
      id: 'camp_01',
      title: 'خصومات الشتاء',
      message: 'خصومات تصل إلى 70% على جميع المعروضات لفترة محدودة.',
      clickUrl: 'https://global-mall.com/winter-sale',
      status: 'completed',
      stats: { sent: 50000, delivered: 49500, clicked: 7200 },
      targetType: 'segment',
      appId: 'app_ent_01',
      createdAt: '2023-12-15',
      targetDomains: ['global-mall.com'],
      sentCount: 50000
    }
  ];

  async getApps() { return this.apps; }

  async verifyDomain(appId: string): Promise<boolean> {
    // محاكاة عملية التحقق - في الواقع يقوم السيرفر بطلب الدومين والبحث عن الـ Tag
    return new Promise(resolve => {
      setTimeout(() => {
        const app = this.apps.find(a => a.id === appId);
        if (app) app.status = 'active';
        resolve(true);
      }, 2000);
    });
  }

  async getWorkflows() { return this.workflows; }

  // Added getCampaigns method
  async getCampaigns(): Promise<Campaign[]> {
    return this.campaigns;
  }

  async getStats(appId: string): Promise<Stats> {
    return {
      totalSubscribers: 84200,
      activeLast24h: 12400,
      avgClickRate: 14.5,
      conversionRate: 3.2,
      countryDistribution: [
        { name: 'السعودية', value: 40 }, { name: 'الإمارات', value: 25 },
        { name: 'مصر', value: 20 }, { name: 'أخرى', value: 15 }
      ],
      deviceDistribution: [
        { name: 'Mobile', value: 82 }, { name: 'Desktop', value: 18 }
      ],
      timeline: Array.from({ length: 15 }, (_, i) => ({
        date: `${i + 1} Dec`,
        sent: Math.floor(Math.random() * 5000) + 2000,
        clicks: Math.floor(Math.random() * 800) + 100
      }))
    };
  }

  async sendCampaign(campaign: Partial<Campaign>): Promise<boolean> {
    // محاكاة إرسال لـ FCM HTTP v1
    console.log("Pushing payload to: https://fcm.googleapis.com/v1/projects/...");
    return true;
  }

  // Added sendFCMNotification method to match CampaignsView.tsx usage
  async sendFCMNotification(data: { title: string; message: string; url: string; targetDomains: string[] }): Promise<boolean> {
    console.log("Sending segment notification:", data);
    const newCampaign: Campaign = {
      id: `camp_${Date.now()}`,
      title: data.title,
      message: data.message,
      clickUrl: data.url,
      status: 'completed',
      stats: { sent: 1500, delivered: 1480, clicked: 0 },
      targetType: 'segment',
      appId: 'app_ent_01',
      createdAt: new Date().toISOString().split('T')[0],
      targetDomains: data.targetDomains,
      sentCount: 1500
    };
    this.campaigns.unshift(newCampaign);
    return true;
  }
}