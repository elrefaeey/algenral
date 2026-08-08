import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { useLanguage } from '@/contexts/LanguageContext';
import hero1 from '@/assets/hero-1.jpg';
import hero2 from '@/assets/hero-2.jpg';
import hero3 from '@/assets/hero-3.jpg';

const HERO_SLIDES = [hero1, hero2, hero3];
const HERO_INTERVAL_MS = 3000;

const Index = () => {
  const [homeContent, setHomeContent] = useState<HomeContent>(defaultHomeContent);
  const [allCars, setAllCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const { t, lang, isRTL } = useLanguage();

  useSEO({
    title:
      lang === 'ar'
        ? seoContent.home.title
        : 'Luxury Car Rental in Dubai | AL GENERAL CAR RENTAL',
    description:
      lang === 'ar'
        ? seoContent.home.description
        : 'AL GENERAL luxury car rental in Dubai. Daily, weekly, and monthly hire with airport delivery and 24/7 support.',
    keywords: seoContent.home.keywords,
    canonical: getCanonicalUrl('/'),
    ogImage: 'https://algenral.vercel.app/logo.png',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [content, cars] = await Promise.all([
          getHomeContent().catch(() => defaultHomeContent),
          getAvailableCars().catch(() => []),
        ]);
        setHomeContent(content);
        setAllCars(cars);
      } catch (error) {
        console.error('Error fetching home data:', error);
        setHomeContent(defaultHomeContent);
        setAllCars([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const useVideo =
    homeContent.backgroundType === 'video' && Boolean(homeContent.backgroundUrl);

  useEffect(() => {
    if (useVideo) return;
    const id = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, HERO_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [useVideo]);

  const subtitle =
    lang === 'ar'
      ? homeContent.subtitle || t.home.fallbackSubtitle
      : t.home.fallbackSubtitle;
  const ctaText =
    lang === 'ar' ? homeContent.ctaButtonText || t.home.ctaDefault : t.home.ctaDefault;
  const waText =
    lang === 'ar' ? homeContent.whatsappButtonText || t.home.waDefault : t.home.waDefault;
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  return (
    <HomeLayout showFooter={true}>
      <SchemaOrganization />
      <SchemaLocalBusiness />
      <SchemaFAQ />
      <SchemaBreadcrumb items={[{ name: t.nav.home, url: '/' }]} />

      <section className="relative min-h-[100svh] flex items-end md:items-center overflow-hidden">
        <div className="absolute inset-0">
          {useVideo ? (
            <video
              src={homeContent.backgroundUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <AnimatePresence mode="sync">
              <motion.img
                key={heroIndex}
                src={HERO_SLIDES[heroIndex]}
                alt={t.home.headline}
                className="absolute inset-0 w-full h-full object-cover object-center"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/40" />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-ink/45" />
        </div>

        <div className="relative z-10 section-container w-full pt-24 pb-20 sm:pt-28 sm:pb-16 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-2xl space-y-4 sm:space-y-6 md:space-y-8"
          >
            <div
              className="pointer-events-none absolute -inset-3 sm:-inset-8 -z-10 rounded-2xl"
              style={{
                background:
                  'radial-gradient(ellipse at center, hsl(210 28% 8% / 0.5), transparent 70%)',
              }}
            />
            <div className="space-y-2 sm:space-y-3">
              <p className="font-display text-white text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl tracking-[0.12em] sm:tracking-[0.16em] leading-none drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]">
                AL GENERAL
              </p>
              <p className="text-primary text-xs sm:text-sm md:text-base font-medium tracking-[0.18em] sm:tracking-[0.28em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
                {t.brand.tagline}
              </p>
            </div>

            <div className="luxury-divider mx-0 w-16 sm:w-20 bg-gradient-to-l from-transparent via-primary to-primary" />

            <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-white leading-snug text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              {t.home.headline}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/90 max-w-xl leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]">
              {subtitle}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2"
            >
              {homeContent.showCta && (
                <Button asChild size="lg" className="btn-gold px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-md touch-manipulation">
                  <Link to="/cars">
                    {ctaText}
                    <Chevron className="ms-2 w-5 h-5" />
                  </Link>
                </Button>
              )}
              {homeContent.showWhatsapp && (
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-ink hover:bg-white/90 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-md font-semibold border-0 touch-manipulation"
                >
                  <a
                    href="https://wa.me/971555900747"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {waText}
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>

        {!useVideo && (
          <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => setHeroIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 touch-manipulation ${
                  i === heroIndex ? 'w-7 sm:w-8 bg-primary' : 'w-2.5 bg-white/45 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      <section className="py-12 sm:py-16 md:py-24">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 sm:mb-12 md:mb-14 max-w-2xl"
          >
            <p className="section-eyebrow mb-2 sm:mb-3">{t.home.fleetEyebrow}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
              {t.home.fleetTitle}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">{t.home.fleetDesc}</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-md" />
              ))}
            </div>
          ) : allCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {allCars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-12">{t.home.noCars}</p>
          )}

          {allCars.length > 0 && (
            <div className="mt-12 text-center">
              <Button asChild variant="outline" className="btn-outline-gold rounded-md px-8">
                <Link to="/cars">{t.home.viewFleet}</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-ink" />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(ellipse 70% 80% at 10% 50%, hsl(36 42% 46% / 0.2), transparent)',
          }}
        />
        <div className="section-container relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <p className="section-eyebrow text-primary">{t.home.experienceEyebrow}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-balance">
              {t.home.experienceTitle}
            </h2>
            <p className="text-white/65 text-lg leading-relaxed">{t.home.experienceIntro}</p>
            <div className="grid sm:grid-cols-3 gap-8 pt-8 text-start sm:text-center">
              {[
                { title: t.home.feature1Title, desc: t.home.feature1Desc },
                { title: t.home.feature2Title, desc: t.home.feature2Desc },
                { title: t.home.feature3Title, desc: t.home.feature3Desc },
              ].map((item) => (
                <div key={item.title} className="space-y-2">
                  <div className="luxury-divider sm:mx-auto w-10" />
                  <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                  <p className="text-sm text-white/55 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </HomeLayout>
  );
};

export default Index;
