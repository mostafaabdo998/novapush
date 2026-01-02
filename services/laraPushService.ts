
import { Domain, Campaign, Stats } from '../types';

const CONFIG = {
  endpoint: 'https://push.nbdmasr.com/api/createCampaign',
  bridge: 'https://push.nbdmasr.com/api_bridge.php',
  db_password: 'B77E1KQH0KJCG4L8',
  admin_email: 'admin@pushnova.com',
  main_domain: 'nbdmasr.com',
  engine_domain: 'push.nbdmasr.com'
};

export class LaraPushService {
  private static instance: LaraPushService;
  
  static getInstance() {
    if (!this.instance) this.instance = new LaraPushService();
    return this.instance;
  }

  private segments: Domain[] = [
    { 
      id: 'seg_shoes_01', 
      url: 'shoes-store.com', 
      type: 'domain',
      status: 'active', 
      subscribers: 8420, 
      createdAt: '2024-05-10'
    }
  ];

  async getDomains(): Promise<Domain[]> {
    return [...this.segments];
  }

  async addDomain(url: string, type: 'domain' | 'segment'): Promise<Domain> {
    const cleanUrl = url.trim().replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
    
    try {
      // إرسال الطلب للجسر ليقرر: هل يضيف Domain في لارا بوش أم يضيف Tag
      const response = await fetch(CONFIG.bridge, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: cleanUrl,
          type: type, // 'domain' أو 'segment'
          action: 'register_resource'
        })
      });

      const newEntry: Domain = {
        id: Math.random().toString(36).substr(2, 9),
        url: cleanUrl,
        type: type,
        status: 'active', 
        subscribers: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };

      this.segments.push(newEntry);
      return newEntry;

    } catch (error: any) {
      console.error("Registration Error:", error);
      throw error;
    }
  }

  async sendNotification(campaign: Partial<Campaign>): Promise<boolean> {
    // المحرك يرسل بناءً على الـ tags والـ domains المختارة
    const payload = {
      email: CONFIG.admin_email,
      password: CONFIG.db_password,
      title: campaign.title,
      message: campaign.message,
      url: campaign.url,
      "domains[]": campaign.targetDomains, // لارا بوش يقبل الدومينات والتاغات هنا
      schedule_now: 1
    };

    const response = await fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return response.ok;
  }

  async getStats(segmentTag: string): Promise<Stats> {
    return {
      totalSubscribers: 8420,
      growth: 12.5,
      countries: [{ name: 'السعودية', value: 4200 }, { name: 'مصر', value: 2100 }],
      devices: [],
      dailyActive: []
    };
  }

  async getCampaigns(): Promise<Campaign[]> {
    return [];
  }
}
