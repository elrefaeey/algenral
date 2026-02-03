import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { HomeLayout } from '@/components/layout/HomeLayout';
import { getHomeContent, getAvailableCars } from '@/services/firebaseService';
import { HomeContent, Car as CarType, defaultHomeContent } from '@/types';
import { CarCard } from '@/components/cars/CarCard';
import { useSEO } from '@/hooks/useSEO';
import { seoContent, getCanonicalUrl } from '@/utils/seoHelpers';
import { SchemaOrganization } from '@/components/seo/SchemaOrganization';
import { SchemaLocalBusiness } from '@/components/seo/SchemaLocalBusiness';
import { SchemaBreadcrumb } from '@/components/seo/SchemaBreadcrumb';
import { SchemaFAQ } from '@/components/seo/SchemaFAQ';
import heroBg from '@/assets/hero-bg.jpg';

const Index = () => {
  const [homeContent, setHomeContent] = useState<HomeContent>(defaultHomeContent);
  const [allCars, setAllCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);

  // SEO Configuration
  useSEO({
    title: seoContent.home.title,
    description: seoContent.home.description,
    keywords: seoContent.home.keywords,
    canonical: getCanonicalUrl('/'),
    ogImage: 'https://algenral.vercel.app/src/assets/logo.png'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [content, cars] = await Promise.all([
          getHomeContent().catch(() => defaultHomeContent),
          getAvailableCars().catch(() => []),
        ]);
        setHomeContent(content);
        setAllCars(cars); // عرض جميع السيارات بدلاً من 3 فقط
      } catch (error) {
        console.error('Error fetching home data:', error);
        // Use default content if there's an error
        setHomeContent(defaultHomeContent);
        setAllCars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <HomeLayout showFooter={true}>
      {/* SEO Schema Components */}
      <SchemaOrganization />
      <SchemaLocalBusiness />
      <SchemaFAQ />
      <SchemaBreadcrumb items={[{ name: 'الرئيسية', url: '/' }]} />

      {/* Hero Section */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={homeContent.backgroundUrl || heroBg}
            alt="تأجير سيارات في دبي - AL GENERAL CAR RENTAL"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 section-container text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Star className="w-4 h-4 fill-primary" />
                أفضل خدمة تأجير سيارات في دبي
              </span>
            </motion.div>

            {/* Title - SEO Optimized H1 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
            >
              تأجير سيارات في دبي
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto"
            >
              {homeContent.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              {homeContent.showCta && (
                <Button asChild size="lg" className="btn-gold px-8 py-6 text-lg">
                  <Link to="/cars">
                    {homeContent.ctaButtonText}
                    <ChevronLeft className="mr-2 w-5 h-5" />
                  </Link>
                </Button>
              )}
              {homeContent.showWhatsapp && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="btn-outline-gold px-8 py-6 text-lg"
                >
                  <a
                    href="https://wa.me/971555900747"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {homeContent.whatsappButtonText}
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* All Cars */}
      {allCars.length > 0 && (
        <section className="py-20">
          <div className="section-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-bold text-foreground mb-2">سياراتنا المتاحة</h2>
              <p className="text-muted-foreground">اختر من مجموعة واسعة من السيارات المتاحة للحجز</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {allCars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO Content Section */}
      <section className="py-16 bg-muted/30">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              AL GENERAL CAR RENTAL - شركة تأجير السيارات الرائدة في دبي
            </h2>
            <div className="prose prose-lg mx-auto text-muted-foreground leading-relaxed">
              <p className="mb-4">
                {seoContent.home.intro}
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8 text-sm">
                <div className="bg-background/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">خدمات متنوعة</h3>
                  <p>تأجير يومي، أسبوعي، وشهري لجميع أنواع السيارات</p>
                </div>
                <div className="bg-background/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">توصيل مجاني</h3>
                  <p>خدمة توصيل السيارات للمطار وجميع أنحاء دبي</p>
                </div>
                <div className="bg-background/50 p-4 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-2">خدمة 24/7</h3>
                  <p>فريق خدمة العملاء متاح على مدار الساعة</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </HomeLayout>
  );
};

export default Index;
