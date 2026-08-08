export interface Car {
  id: string;
  name: string;
  nameAr: string;
  images: string[];
  priceDaily: number;
  priceWeekly: number;
  priceMonthly: number;
  transmission: 'automatic' | 'manual';
  passengers: number;
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  description: string;
  descriptionAr: string;
  available: boolean;
  category: string;
  year: number;
  order?: number;
  /** Optional SEO overrides from admin */
  slug?: string;
  metaTitle?: string;
  metaTitleAr?: string;
  metaDescription?: string;
  metaDescriptionAr?: string;
  imageAlts?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  carId: string;
  carName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupDate: Date;
  pickupTime: string;
  dropoffDate: Date;
  dropoffTime: string;
  totalDays: number;
  pricePerDay: number;
  totalPrice: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface HomeContent {
  backgroundType: 'image' | 'video';
  backgroundUrl: string;
  mainTitle: string;
  subtitle: string;
  ctaButtonText: string;
  whatsappButtonText: string;
  showCta: boolean;
  showWhatsapp: boolean;
}

export interface SiteSettings {
  companyName: string;
  companyNameAr: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  addressAr: string;
  licenseNumber: string;
}

export const defaultHomeContent: HomeContent = {
  backgroundType: 'image',
  backgroundUrl: '',
  mainTitle: 'الچينرال لتأجير السيارات',
  subtitle: 'تأجير سيارات فاخرة في دبي',
  ctaButtonText: 'احجز الآن',
  whatsappButtonText: 'تواصل واتساب',
  showCta: true,
  showWhatsapp: true,
};

export const defaultSiteSettings: SiteSettings = {
  companyName: 'AL GENERAL CAR RENTAL',
  companyNameAr: 'الچينرال لتأجير السيارات',
  phone: '00971555900747',
  whatsapp: '+971555900747',
  email: 'info@algeneralrental.com',
  address: 'Office 302, Hoor Al Anz East – Dubai – UAE',
  addressAr: 'مكتب 302، هور العنز شرق - دبي - الإمارات',
  licenseNumber: '1175479',
};
