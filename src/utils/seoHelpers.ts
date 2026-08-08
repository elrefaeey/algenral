import { Car } from '@/types';
import type { Lang } from '@/i18n/translations';

export const SITE_URL = 'https://algenral.vercel.app';

export const getCanonicalUrl = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized === '/' ? '/' : normalized.replace(/\/$/, '')}`;
};

/** Resolve relative or absolute image URLs for OG / Schema */
export const toAbsoluteUrl = (url?: string | null): string => {
  if (!url) return `${SITE_URL}/logo.png`;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ar-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
  }).format(price);
};

type PageKey = 'home' | 'cars' | 'about' | 'contact';

type LocalizedSeo = {
  title: string;
  description: string;
  keywords: string;
  intro?: string;
};

export const seoContent: Record<Lang, Record<PageKey, LocalizedSeo>> = {
  ar: {
    home: {
      title: 'تأجير سيارات في دبي | AL GENERAL CAR RENTAL',
      description:
        'تأجير سيارات فاخرة واقتصادية في دبي مع توصيل لمطار دبي وخدمة 24/7. إيجار يومي وأسبوعي وشهري من الچينرال لتأجير السيارات.',
      keywords:
        'تأجير سيارات دبي, سيارات للإيجار في دبي, تأجير سيارات مطار دبي, تأجير سيارات فاخرة دبي, تأجير شهري دبي, rent a car dubai, car rental dubai airport, SUV للإيجار دبي',
      intro:
        'شركة AL GENERAL CAR RENTAL من الشركات الرائدة في تأجير السيارات في دبي. نوفر أسطولاً مختاراً، توصيلاً للمطار، وخدمة عملاء على مدار الساعة.',
    },
    cars: {
      title: 'سيارات للإيجار في دبي | أسطول الچينرال',
      description:
        'تصفح سيارات للإيجار في دبي: فاخرة، اقتصادية، عائلية ورياضية. توصيل مطار دبي، تأمين شامل، وحجز سهل عبر واتساب.',
      keywords:
        'سيارات للإيجار في دبي, تأجير سيارات فاخرة دبي, تأجير سيارات اقتصادية, SUV دبي, تأجير يومي دبي, car rental dubai fleet',
      intro:
        'أسطول متنوع للإيجار اليومي والأسبوعي والشهري في دبي، مع تأمين شامل وخدمة توصيل للمطار والمناطق الرئيسية.',
    },
    about: {
      title: 'من نحن | AL GENERAL CAR RENTAL دبي',
      description:
        'تعرف على الچينرال لتأجير السيارات في دبي: خبرة، أسطول مختار، توصيل للمطار، وخدمة كونسيرج على مدار الساعة.',
      keywords:
        'من نحن, AL GENERAL CAR RENTAL, شركة تأجير سيارات دبي, about car rental dubai',
    },
    contact: {
      title: 'تواصل معنا | AL GENERAL CAR RENTAL دبي',
      description:
        'تواصل مع فريق الچينرال في دبي — واتساب وهاتف 24/7، مكتب 302 هور العنز شرق، توصيل مطار دبي.',
      keywords:
        'تواصل معنا, تأجير سيارات دبي واتساب, خدمة عملاء تأجير سيارات, contact car rental dubai',
    },
  },
  en: {
    home: {
      title: 'Luxury Car Rental in Dubai | AL GENERAL CAR RENTAL',
      description:
        'Rent luxury and everyday cars in Dubai with airport delivery and 24/7 support. Daily, weekly, and monthly hire from AL GENERAL.',
      keywords:
        'car rental dubai, rent a car dubai, dubai airport car rental, luxury car rental dubai, monthly car rental dubai, SUV rental dubai, Marina car rental',
      intro:
        'AL GENERAL CAR RENTAL is a leading Dubai car rental company with a curated fleet, airport delivery, and round-the-clock concierge support.',
    },
    cars: {
      title: 'Cars for Rent in Dubai | AL GENERAL Fleet',
      description:
        'Browse luxury, economy, family and sports cars for rent in Dubai. Airport delivery, full insurance, and easy WhatsApp booking.',
      keywords:
        'cars for rent dubai, luxury car hire dubai, economy car rental dubai, SUV rental dubai, daily car rental dubai',
      intro:
        'A diverse Dubai fleet for daily, weekly, and monthly rental — with airport delivery and comprehensive insurance.',
    },
    about: {
      title: 'About Us | AL GENERAL CAR RENTAL Dubai',
      description:
        'Learn about AL GENERAL CAR RENTAL in Dubai — curated fleet, airport delivery, and 24/7 concierge service.',
      keywords:
        'about AL GENERAL CAR RENTAL, car rental company dubai, dubai chauffeur free rental',
    },
    contact: {
      title: 'Contact Us | AL GENERAL CAR RENTAL Dubai',
      description:
        'Contact AL GENERAL in Dubai — WhatsApp & phone 24/7, Office 302 Hoor Al Anz East, Dubai Airport delivery.',
      keywords:
        'contact car rental dubai, dubai car hire whatsapp, AL GENERAL contact',
    },
  },
};

export const getPageSeo = (page: PageKey, lang: Lang): LocalizedSeo => {
  return seoContent[lang][page];
};

export const generateCarTitle = (car: Car, lang: Lang = 'ar'): string => {
  if (lang === 'ar') {
    return car.metaTitleAr?.trim() || `تأجير ${car.nameAr} في دبي | AL GENERAL CAR RENTAL`;
  }
  return car.metaTitle?.trim() || `Rent ${car.name} in Dubai | AL GENERAL CAR RENTAL`;
};

export const generateCarDescription = (car: Car, lang: Lang = 'ar'): string => {
  if (lang === 'ar') {
    if (car.metaDescriptionAr?.trim()) return car.metaDescriptionAr.trim();
    const desc = car.descriptionAr || car.description || '';
    return `احجز ${car.nameAr} للإيجار في دبي. ${desc} توصيل لمطار دبي وخدمة عملاء 24 ساعة من الچينرال.`.trim();
  }
  if (car.metaDescription?.trim()) return car.metaDescription.trim();
  const desc = car.description || car.descriptionAr || '';
  return `Rent ${car.name} in Dubai. ${desc} Airport delivery and 24/7 support from AL GENERAL CAR RENTAL.`.trim();
};

export const generateCarKeywords = (car: Car, lang: Lang = 'ar'): string => {
  const baseAr = [
    'تأجير سيارات دبي',
    'سيارات للإيجار في دبي',
    'تأجير سيارات مطار دبي',
    'rent a car dubai',
    'car rental dubai',
  ];
  const baseEn = [
    'car rental dubai',
    'rent a car dubai',
    'dubai airport car rental',
    'luxury car rental dubai',
  ];
  const specific =
    lang === 'ar'
      ? [`تأجير ${car.nameAr}`, `${car.nameAr} للإيجار`, `rent ${car.name} dubai`, car.category]
      : [`rent ${car.name} dubai`, `${car.name} car rental dubai`, car.category, car.nameAr];

  return [...(lang === 'ar' ? baseAr : baseEn), ...specific.filter(Boolean)].join(', ');
};

export const getCarPath = (car: Car): string => {
  if (car.slug?.trim()) return `/cars/${car.slug.trim()}`;
  return `/cars/${car.id}`;
};
