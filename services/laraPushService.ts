
import { Domain, Campaign, Stats } from '../types';

/**
 * محرك PushNova SaaS - النسخة المتصلة بالجسر البرمجي الحقيقي
 * هذا الملف هو القلب التقني الذي يربط واجهتك بقاعدة بيانات لارا بوش lp_db
 */

const CONFIG = {
  endpoint: 'https://push.nbdmasr.com/api/createCampaign',
  bridge: 'https://push.nbdmasr.com/api_bridge.php',
  db_password: 'B77E1KQH0KJCG4L8',
  admin_email: 'admin@pushnova.com'
};

export class LaraPushService {
  private static instance: LaraPushService;
  
  static getInstance() {
    if (!this.instance) this.instance = new LaraPushService();
    return this.instance;
  }

  // مصفوفة محلية لعرض البيانات فوراً (يجب في المستقبل جلبها عبر GET من الجسر)
  private domains: Domain[] = [
    { 
      id: 'd_shoes_01', 
      url: 'shoes-store.com', 
      status: 'active', 
      subscribers: 8420, 
      createdAt: '2024-05-10', 
      publicKey: 'B77E1KQH0KJCG4L8_P1' 
    }
  ];

  async getDomains(): Promise<Domain[]> {
    return [...this.domains];
  }

  /**
   * الخطوة الحاسمة: إضافة الدومين لقاعدة بيانات لارا بوش
   */
  async addDomain(url: string): Promise<Domain> {
    // تنظيف النطاق (إزالة البروتوكول والمسارات الزائدة) لضمان التوافق مع لارا بوش
    const cleanUrl = url.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
    
    try {
      console.log(`[PushNova] Sending to Bridge: ${cleanUrl}`);
      
      const response = await fetch(CONFIG.bridge, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain_url: cleanUrl })
      });

      // التحقق من أن الاستجابة صالحة
      if (!response.ok) {
        throw new Error(`خطأ في السيرفر: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "فشل السيرفر في تنفيذ SQL INSERT");
      }

      // بعد النجاح في السيرفر، نقوم بتحديث الواجهة المحلية
      const newDomain: Domain = {
        id: 'd_' + Math.random().toString(36).substr(2, 6),
        url: cleanUrl,
        status: 'active', 
        subscribers: 0,
        createdAt: new Date().toISOString().split('T')[0],
        publicKey: 'B77E1KQH0KJCG4L8_' + Math.random().toString(36).substr(2, 4).toUpperCase()
      };

      this.domains.push(newDomain);
      return newDomain;

    } catch (error) {
      console.error("Critical Connection Error:", error);
      throw error;
    }
  }

  async getStats(domainUrl: string): Promise<Stats> {
    return {
      totalSubscribers: domainUrl === 'shoes-store.com' ? 8420 : 0,
      growth: domainUrl === 'shoes-store.com' ? 12.5 : 0,
      countries: domainUrl === 'shoes-store.com' ? [
        { name: 'السعودية', value: 4200 },
        { name: 'مصر', value: 2100 }
      ] : [],
      devices: [],
      dailyActive: []
    };
  }

  async sendNotification(campaign: Partial<Campaign>): Promise<boolean> {
    const payload = {
      email: CONFIG.admin_email,
      password: CONFIG.db_password,
      title: campaign.title,
      message: campaign.message,
      url: campaign.url,
      "domains[]": campaign.targetDomains,
      schedule_now: 1
    };

    const response = await fetch(CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return response.ok;
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
