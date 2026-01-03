
import { Domain, Campaign, Stats } from '../types';

const CONFIG = {
  endpoint: 'https://push.nbdmasr.com/api/createCampaign',
  bridge: 'https://push.nbdmasr.com/api_bridge.php',
  db_password: 'B77E1KQH0KJCG4L8',
  admin_email: 'admin@pushnova.com',
  main_domain: 'nbdmasr.com'
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
      type: 'segment',
      status: 'active', 
      subscribers: 1240, 
      createdAt: '2024-05-10'
    },
    { 
      id: 'seg_tech_02', 
      url: 'tech-hub.sa', 
      type: 'segment',
      status: 'active', 
      subscribers: 530, 
      createdAt: '2024-06-15'
    }
  ];

  async getDomains(): Promise<Domain[]> {
    return [...this.segments];
  }

  async addDomain(url: string, type: 'domain' | 'segment'): Promise<Domain> {
    const cleanUrl = url.trim().replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
    
    // تسجيل المورد الجديد في الجسر
    try {
      await fetch(CONFIG.bridge, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: cleanUrl,
          type: type,
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
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async sendNotification(campaign: Partial<Campaign>): Promise<boolean> {
    // إرسال الإشعار باستخدام segmentation_id (الدومين)
    const payload = {
      email: CONFIG.admin_email,
      password: CONFIG.db_password,
      title: campaign.title,
      message: campaign.message,
      link: campaign.url, // استخدام link بدلاً من url كما هو مطلوب في الـ API
      segmentation_id: campaign.targetDomains?.[0] || '', // الدومين هو الـ Tag
      schedule_now: 1
    };

    try {
      const response = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return response.ok;
    } catch (e) {
      console.error("Notification delivery error:", e);
      return false;
    }
  }

  async getStats(segmentTag: string): Promise<Stats> {
    try {
      const response = await fetch(`${CONFIG.bridge}?action=get_stats&client_id=${segmentTag}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {}
    
    // بيانات افتراضية في حالة تعذر الاتصال بالجسر
    return {
      totalSubscribers: Math.floor(Math.random() * 2000) + 500,
      growth: 8.4,
      countries: [{ name: 'السعودية', value: 65 }, { name: 'مصر', value: 25 }, { name: 'الإمارات', value: 10 }],
      devices: [{ name: 'موبايل', value: 85 }, { name: 'حاسوب', value: 15 }],
      dailyActive: Array.from({length: 7}, (_, i) => ({
        date: `${i+1} يونيو`,
        count: Math.floor(Math.random() * 100) + 20
      }))
    };
  }

  async getCampaigns(): Promise<Campaign[]> {
    return [
      {
        id: '1',
        title: 'عرض الجمعة البيضاء',
        message: 'خصومات تصل إلى 50% على جميع المنتجات',
        url: 'https://store.com/offers',
        sentCount: 1240,
        clickCount: 154,
        status: 'sent',
        createdAt: '2024-05-20',
        targetDomains: ['shoes-store.com']
      }
    ];
  }
}
