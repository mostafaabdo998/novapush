
import { Domain, Campaign, Stats } from '../types';

/**
 * محرك PushNova SaaS - نظام النطاق المركزي والتقسيم
 * المحرك (Engine): push.nbdmasr.com
 * صفحة الاشتراك (Landing): nbdmasr.com
 */

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
      status: 'active', 
      subscribers: 8420, 
      createdAt: '2024-05-10', 
      publicKey: 'B77E1KQH0KJCG4L8_P1' 
    }
  ];

  async getDomains(): Promise<Domain[]> {
    return [...this.segments];
  }

  async addDomain(url: string): Promise<Domain> {
    const cleanTag = url.trim().replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
    
    try {
      const response = await fetch(CONFIG.bridge, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          segment_tag: cleanTag,
          action: 'create_segment'
        })
      });

      if (!response.ok) throw new Error(`خطأ اتصال: ${response.status}`);

      const result = await response.json();
      if (!result.success) throw new Error(result.message);

      const newSegment: Domain = {
        id: 'seg_' + Math.random().toString(36).substr(2, 6),
        url: cleanTag,
        status: 'active', 
        subscribers: 0,
        createdAt: new Date().toISOString().split('T')[0],
        publicKey: 'B77E1KQH0KJCG4L8_' + Math.random().toString(36).substr(2, 4).toUpperCase()
      };

      this.segments.push(newSegment);
      return newSegment;

    } catch (error: any) {
      console.error("Segment Registration Error:", error);
      throw error;
    }
  }

  async sendNotification(campaign: Partial<Campaign>): Promise<boolean> {
    const payload = {
      email: CONFIG.admin_email,
      password: CONFIG.db_password,
      title: campaign.title,
      message: campaign.message,
      url: campaign.url,
      "tags[]": campaign.targetDomains, 
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
      totalSubscribers: segmentTag === 'shoes-store.com' ? 8420 : 0,
      growth: 12.5,
      countries: [
        { name: 'السعودية', value: 4200 },
        { name: 'مصر', value: 2100 }
      ],
      devices: [],
      dailyActive: []
    };
  }

  async getCampaigns(): Promise<Campaign[]> {
    return [
      {
        id: 'c_88',
        title: 'عروض الصيف الحصرية 🏖️',
        message: 'استمتع بخصم 40% على كافة المنتجات عند استخدام الكود SUMMER.',
        url: 'https://shoes-store.com/promo',
        sentCount: 8420,
        clickCount: 1120,
        status: 'sent',
        createdAt: '2024-05-25 10:00',
        targetDomains: ['shoes-store.com']
      }
    ];
  }
}
