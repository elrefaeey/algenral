import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { CarCard } from '@/components/cars/CarCard';
import { EmptyState } from '@/components/cars/EmptyState';
import { getCars } from '@/services/firebaseService';
import { Car } from '@/types';
import { useSEO } from '@/hooks/useSEO';
import { seoContent, getCanonicalUrl } from '@/utils/seoHelpers';
import { SchemaBreadcrumb } from '@/components/seo/SchemaBreadcrumb';
import { Loader2, ChevronRight } from 'lucide-react';

const CarsPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // SEO Configuration
  useSEO({
    title: seoContent.cars.title,
    description: seoContent.cars.description,
    keywords: seoContent.cars.keywords,
    canonical: getCanonicalUrl('/cars'),
    ogImage: 'https://algenral.vercel.app/src/assets/logo.png'
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
      {/* SEO Schema Components */}
      <SchemaBreadcrumb items={[
        { name: 'الرئيسية', url: '/' },
        { name: 'السيارات', url: '/cars' }
      ]} />

      <div className="section-container py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">سيارات للإيجار في دبي</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            اختر سيارتك المفضلة من مجموعتنا المتنوعة من السيارات الفاخرة والاقتصادية
          </p>
        </motion.div>

        {/* Cars Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : cars.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        )}

        {/* SEO Content Section */}
        {!loading && cars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-muted/30 rounded-lg p-8"
          >
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                تأجير سيارات في دبي - خيارات متنوعة وأسعار مميزة
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {seoContent.cars.intro}
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="text-right">
                  <h3 className="font-semibold text-foreground mb-2">أنواع السيارات المتاحة:</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• سيارات اقتصادية للاستخدام اليومي</li>
                    <li>• سيارات فاخرة للمناسبات الخاصة</li>
                    <li>• سيارات عائلية واسعة</li>
                    <li>• سيارات رياضية عالية الأداء</li>
                  </ul>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold text-foreground mb-2">خدماتنا المميزة:</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• توصيل مجاني لمطار دبي</li>
                    <li>• تأجير يومي وأسبوعي وشهري</li>
                    <li>• تأمين شامل على جميع السيارات</li>
                    <li>• خدمة عملاء 24 ساعة</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default CarsPage;
