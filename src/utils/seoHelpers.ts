import { Car } from '@/types';

export const generateCarTitle = (car: Car): string => {
  return `تأجير ${car.nameAr} في دبي | AL GENERAL CAR RENTAL`;
};

export const generateCarDescription = (car: Car): string => {
  return `احجز ${car.nameAr} للإيجار في دبي بأفضل الأسعار. ${car.descriptionAr} - خدمة توصيل مجاني للمطار وخدمة عملاء 24 ساعة.`;
};

export const generateCarKeywords = (car: Car): string => {
  const baseKeywords = [
    'تأجير سيارات دبي',
    'سيارات للإيجار في دبي',
    'rent a car dubai',
    'car rental dubai',
    'تأجير سيارات رخيص دبي'
  ];
  
  const carSpecificKeywords = [
    `تأجير ${car.nameAr}`,
    `${car.nameAr} للإيجار`,
    `rent ${car.name} dubai`,
    car.category
  ];
  
  return [...baseKeywords, ...carSpecificKeywords].join(', ');
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ar-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0
  }).format(price);
};

export const getCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://algenral.vercel.app';
  return `${baseUrl}${path}`;
};

// SEO-optimized content snippets
export const seoContent = {
  home: {
    title: 'تأجير سيارات في دبي | AL GENERAL CAR RENTAL',
    description: 'شركة AL GENERAL لتأجير السيارات في دبي بأسعار مميزة. تأجير يومي، أسبوعي، شهري مع توصيل للمطار وخدمة عملاء 24 ساعة.',
    keywords: 'تأجير سيارات دبي, سيارات للإيجار في دبي, rent a car dubai, تأجير سيارات رخيص دبي, car rental dubai airport',
    intro: 'شركة AL GENERAL CAR RENTAL هي إحدى الشركات الرائدة في مجال تأجير السيارات في دبي والإمارات العربية المتحدة. نقدم خدمات تأجير السيارات بأسعار تنافسية وجودة عالية، مع توفير مجموعة واسعة من السيارات الفاخرة والاقتصادية لتلبية جميع احتياجاتكم. نوفر خدمة التوصيل المجاني للمطار وخدمة عملاء متاحة على مدار الساعة لضمان راحتكم وسهولة تجربة الإيجار.'
  },
  cars: {
    title: 'سيارات للإيجار في دبي | AL GENERAL CAR RENTAL',
    description: 'اكتشف مجموعتنا الواسعة من السيارات للإيجار في دبي. سيارات فاخرة واقتصادية بأسعار مميزة مع خدمة توصيل مجاني للمطار.',
    keywords: 'سيارات للإيجار في دبي, تأجير سيارات دبي, rent a car dubai, سيارات فاخرة للإيجار, تأجير سيارات اقتصادية دبي',
    intro: 'تصفح مجموعتنا المتنوعة من السيارات المتاحة للإيجار في دبي. نوفر سيارات فاخرة واقتصادية تناسب جميع الميزانيات والاحتياجات، مع خيارات الإيجار اليومي والأسبوعي والشهري. جميع سياراتنا مؤمنة بالكامل ومجهزة بأحدث التقنيات لضمان رحلة آمنة ومريحة.'
  },
  about: {
    title: 'من نحن | AL GENERAL CAR RENTAL دبي',
    description: 'تعرف على شركة AL GENERAL CAR RENTAL، الشركة الرائدة في تأجير السيارات في دبي مع أكثر من 10 سنوات من الخبرة وخدمة عملاء متميزة.',
    keywords: 'من نحن, AL GENERAL CAR RENTAL, شركة تأجير سيارات دبي, خبرة تأجير سيارات, about car rental dubai'
  },
  contact: {
    title: 'تواصل معنا | AL GENERAL CAR RENTAL دبي',
    description: 'تواصل مع فريق AL GENERAL CAR RENTAL في دبي. خدمة عملاء 24/7، توصيل مجاني للمطار، واستشارة مجانية لاختيار السيارة المناسبة.',
    keywords: 'تواصل معنا, AL GENERAL CAR RENTAL, خدمة عملاء تأجير سيارات دبي, contact car rental dubai'
  }
};