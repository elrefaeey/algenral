import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Users,
  Fuel,
  Settings,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Car as CarIcon,
  ArrowRight,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { BookingForm } from '@/components/booking/BookingForm';
import { getCar } from '@/services/firebaseService';
import { Car } from '@/types';
import { useSEO } from '@/hooks/useSEO';
import {
  generateCarTitle,
  generateCarDescription,
  generateCarKeywords,
  getCanonicalUrl,
} from '@/utils/seoHelpers';
import { SchemaProduct } from '@/components/seo/SchemaProduct';
import { SchemaBreadcrumb } from '@/components/seo/SchemaBreadcrumb';
import { useLanguage } from '@/contexts/LanguageContext';

const SLIDE_INTERVAL_MS = 3000;

const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [paused, setPaused] = useState(false);
  const { t, lang, isRTL } = useLanguage();

  const fuelTypeLabels = {
    petrol: t.car.petrol,
    diesel: t.car.diesel,
    electric: t.car.electric,
    hybrid: t.car.hybrid,
  };

  const transmissionLabels = {
    automatic: t.car.automatic,
    manual: t.car.manual,
  };

  useSEO({
    title: car
      ? lang === 'ar'
        ? generateCarTitle(car)
        : `Rent ${car.name} in Dubai | AL GENERAL CAR RENTAL`
      : lang === 'ar'
        ? 'تفاصيل السيارة | AL GENERAL CAR RENTAL'
        : 'Car Details | AL GENERAL CAR RENTAL',
    description: car
      ? lang === 'ar'
        ? generateCarDescription(car)
        : `Rent ${car.name} in Dubai. ${car.description || ''} Airport delivery and 24/7 support.`
      : lang === 'ar'
        ? 'تفاصيل السيارة للإيجار في دبي'
        : 'Car rental details in Dubai',
    keywords: car ? generateCarKeywords(car) : 'تأجير سيارات دبي',
    canonical: getCanonicalUrl(`/cars/${id}`),
    ogImage: car?.images?.[0]
      ? `https://algenral.vercel.app${car.images[0]}`
      : 'https://algenral.vercel.app/logo.png',
  });

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        const data = await getCar(id);
        setCar(data);
        setSelectedImage(0);
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const images = car?.images?.filter(Boolean) ?? [];

  useEffect(() => {
    if (!car || images.length <= 1 || paused) return;
    const timer = window.setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % images.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [car, images.length, paused]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!car) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">{t.car.notFound}</h1>
          <Link to="/cars" className="text-primary hover:underline">
            {t.car.backToCars}
          </Link>
        </div>
      </Layout>
    );
  }

  const title = lang === 'ar' ? car.nameAr : car.name;
  const subtitle = lang === 'ar' ? car.name : car.nameAr;
  const description = lang === 'ar' ? car.descriptionAr : car.description || car.descriptionAr;
  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;
  const BackIcon = isRTL ? ArrowRight : ChevronLeft;

  const goPrev = () => {
    if (images.length <= 1) return;
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = () => {
    if (images.length <= 1) return;
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const specs = [
    { icon: Users, label: `${car.passengers} ${t.car.passengers}` },
    { icon: Settings, label: transmissionLabels[car.transmission] },
    { icon: Fuel, label: fuelTypeLabels[car.fuelType] },
    { icon: CarIcon, label: String(car.year) },
  ];

  return (
    <Layout>
      <SchemaProduct car={car} />
      <SchemaBreadcrumb
        items={[
          { name: t.nav.home, url: '/' },
          { name: t.nav.cars, url: '/cars' },
          { name: title, url: `/cars/${id}` },
        ]}
      />

      {/* Centered gallery */}
      <section
        className="relative w-full bg-ink"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="section-container pt-6 md:pt-8 pb-8 md:pb-10">
          <div className="mx-auto max-w-5xl">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-ink-soft/80 group">
              {images.length > 0 ? (
                <AnimatePresence mode="sync">
                  <motion.img
                    key={selectedImage}
                    src={images[selectedImage]}
                    alt={`${title} - ${selectedImage + 1}`}
                    className="absolute inset-0 w-full h-full object-contain object-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Settings className="w-16 h-16 text-white/20" />
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goPrev}
                    className="absolute top-1/2 start-3 md:start-4 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 rounded-sm border border-white/20 bg-ink/50 text-white backdrop-blur-sm hover:border-primary/60 transition-all flex items-center justify-center"
                    aria-label="Previous"
                  >
                    <PrevIcon className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    className="absolute top-1/2 end-3 md:end-4 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 rounded-sm border border-white/20 bg-ink/50 text-white backdrop-blur-sm hover:border-primary/60 transition-all flex items-center justify-center"
                    aria-label="Next"
                  >
                    <NextIcon className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex justify-center gap-2.5 overflow-x-auto scrollbar-hide py-1">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative flex-shrink-0 w-[4.5rem] h-14 md:w-24 md:h-16 overflow-hidden transition-all duration-300 ${
                      selectedImage === index
                        ? 'ring-1 ring-primary opacity-100'
                        : 'opacity-40 hover:opacity-80'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Centered title under images */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 md:mt-10 text-center"
            >
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-3">
                <Link
                  to="/cars"
                  className="inline-flex items-center gap-1.5 text-xs tracking-[0.18em] uppercase text-white/60 hover:text-primary transition-colors"
                >
                  <BackIcon className="w-3.5 h-3.5" />
                  {t.nav.cars}
                </Link>
                <span className="text-white/25">·</span>
                <span
                  className={`text-xs tracking-[0.16em] uppercase ${
                    car.available ? 'text-primary' : 'text-red-300'
                  }`}
                >
                  {car.available ? t.car.available : t.car.busy}
                </span>
                {car.category && (
                  <>
                    <span className="text-white/25">·</span>
                    <span className="text-xs tracking-[0.16em] uppercase text-white/50">
                      {car.category}
                    </span>
                  </>
                )}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-white leading-[1.05] tracking-[0.02em]">
                {title}
              </h1>
              <p className="mt-2 text-white/60 text-base md:text-lg tracking-wide">
                {subtitle}
                {car.year ? ` · ${car.year}` : ''}
              </p>
              <div className="luxury-divider mt-6 bg-gradient-to-l from-transparent via-primary/80 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specs + description */}
      <section className="page-band">
        <div className="section-container py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/70 border border-border/70">
              {specs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.45 }}
                  className="bg-background/80 backdrop-blur-sm px-4 py-6 text-center"
                >
                  <spec.icon className="w-4 h-4 text-primary mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm font-medium text-foreground tracking-wide">{spec.label}</p>
                </motion.div>
              ))}
            </div>

            {description && (
              <div className="mt-10 md:mt-12 text-center max-w-2xl mx-auto">
                <p className="section-eyebrow mb-3">{t.car.description}</p>
                <div className="luxury-divider mb-6" />
                <p className="text-muted-foreground text-base md:text-[1.05rem] leading-[1.85] text-balance">
                  {description}
                </p>
              </div>
            )}

            {car.available && (
              <div className="mt-10 flex justify-center">
                <a
                  href="#booking"
                  className="inline-flex items-center gap-2 btn-gold px-8 py-3.5 text-sm tracking-[0.14em] uppercase rounded-sm"
                >
                  {t.car.bookNow}
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Booking under gallery / info */}
      <section id="booking" className="relative border-t border-border/60">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 0%, hsl(36 42% 46% / 0.07), transparent 65%)',
          }}
        />
        <div className="section-container relative py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-8 md:mb-10">
              <p className="section-eyebrow mb-3">{t.car.bookTitle}</p>
              <h2 className="font-display text-3xl md:text-4xl text-foreground tracking-[0.03em]">
                {t.car.bookHeadline}
              </h2>
              <p className="mt-3 text-muted-foreground text-sm md:text-base">
                {t.car.bookSubtitle}
              </p>
              <div className="luxury-divider mt-6" />
            </div>

            <div className="border border-border/70 bg-card/70 backdrop-blur-sm p-6 sm:p-8 md:p-10 shadow-soft">
              <BookingForm car={car} />
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default CarDetailsPage;
