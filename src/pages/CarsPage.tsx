import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { CarCard } from '@/components/cars/CarCard';
import { EmptyState } from '@/components/cars/EmptyState';
import { getCars } from '@/services/firebaseService';
import { Car } from '@/types';
import { useSEO } from '@/hooks/useSEO';
import { getPageSeo, getCanonicalUrl } from '@/utils/seoHelpers';
import { SchemaBreadcrumb } from '@/components/seo/SchemaBreadcrumb';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CarsPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, lang } = useLanguage();
  const pageSeo = getPageSeo('cars', lang);

  useSEO({
    title: pageSeo.title,
    description: pageSeo.description,
    keywords: pageSeo.keywords,
    canonical: getCanonicalUrl('/cars'),
    ogImage: 'https://algenral.vercel.app/logo.png',
    lang,
  });

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getCars();
        setCars(data);
      } catch (error) {
        console.error('Error fetching cars:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <Layout>
      <SchemaBreadcrumb
        items={[
          { name: t.nav.home, url: '/' },
          { name: t.nav.cars, url: '/cars' },
        ]}
      />

      <section className="page-band py-10 sm:py-14 md:py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <p className="section-eyebrow mb-2 sm:mb-3">{t.cars.eyebrow}</p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
              {t.cars.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{t.cars.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16">
        <div className="section-container">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : cars.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {cars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          )}

          {!loading && cars.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20 max-w-3xl"
            >
              <div className="luxury-divider mx-0 mb-8 w-16" />
              <h2 className="text-2xl font-bold text-foreground mb-4">{t.cars.seoTitle}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{t.cars.seoIntro}</p>
              <p className="text-muted-foreground leading-relaxed mb-8">{t.cars.seoExtra}</p>
              <div className="grid md:grid-cols-2 gap-8 text-sm">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">{t.cars.typesTitle}</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {[t.cars.type1, t.cars.type2, t.cars.type3, t.cars.type4].map((item) => (
                      <li key={item} className="border-s-2 border-primary/40 ps-3">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">{t.cars.servicesTitle}</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {[t.cars.service1, t.cars.service2, t.cars.service3, t.cars.service4].map(
                      (item) => (
                        <li key={item} className="border-s-2 border-primary/40 ps-3">
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default CarsPage;
