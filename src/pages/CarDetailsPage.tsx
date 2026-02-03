import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Users, Fuel, Settings, Calendar, Check, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { BookingForm } from '@/components/booking/BookingForm';
import { getCar } from '@/services/firebaseService';
import { Car } from '@/types';
import { Badge } from '@/components/ui/badge';
import { useSEO } from '@/hooks/useSEO';
import { generateCarTitle, generateCarDescription, generateCarKeywords, getCanonicalUrl } from '@/utils/seoHelpers';
import { SchemaProduct } from '@/components/seo/SchemaProduct';
import { SchemaBreadcrumb } from '@/components/seo/SchemaBreadcrumb';

const fuelTypeLabels = {
  petrol: 'بنزين',
  diesel: 'ديزل',
  electric: 'كهربائي',
  hybrid: 'هايبرد',
};

const transmissionLabels = {
  automatic: 'أوتوماتيك',
  manual: 'عادي',
};

const CarDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // SEO Configuration - Dynamic based on car data
  useSEO({
    title: car ? generateCarTitle(car) : 'تفاصيل السيارة | AL GENERAL CAR RENTAL',
    description: car ? generateCarDescription(car) : 'تفاصيل السيارة للإيجار في دبي',
    keywords: car ? generateCarKeywords(car) : 'تأجير سيارات دبي',
    canonical: getCanonicalUrl(`/cars/${id}`),
    ogImage: car?.images?.[0] ? `https://algenral.vercel.app${car.images[0]}` : 'https://algenral.vercel.app/src/assets/logo.png'
  });

  useEffect(() => {
    const fetchCar = async () => {
      if (!id) return;
      try {
        const data = await getCar(id);
        setCar(data);
      } catch (error) {
        console.error('Error fetching car:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

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
          <h1 className="text-2xl font-bold mb-4">السيارة غير موجودة</h1>
          <Link to="/cars" className="text-primary hover:underline">
            العودة إلى السيارات
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* SEO Schema Components */}
      {car && <SchemaProduct car={car} />}
      <SchemaBreadcrumb items={[
        { name: 'الرئيسية', url: '/' },
        { name: 'السيارات', url: '/cars' },
        { name: car?.nameAr || 'تفاصيل السيارة', url: `/cars/${id}` }
      ]} />

      <div className="section-container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted">
              {car.images && car.images.length > 0 ? (
                <img
                  src={car.images[selectedImage]}
                  alt={`تأجير ${car.nameAr} في دبي - صورة ${selectedImage + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Settings className="w-20 h-20 text-muted-foreground/30" />
                </div>
              )}
              <Badge
                className={`absolute top-4 right-4 ${
                  car.available
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-destructive hover:bg-destructive/90'
                }`}
              >
                {car.available ? 'متاحة' : 'مشغولة'}
              </Badge>
            </div>

            {/* Thumbnails */}
            {car.images && car.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${car.nameAr} - صورة ${index + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Car Info */}
            <div className="bg-muted rounded-xl p-6 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{car.nameAr}</h1>
                <p className="text-muted-foreground">{car.name} - {car.year}</p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-background rounded-lg p-3 text-center">
                  <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-sm font-medium">{car.passengers} راكب</p>
                </div>
                <div className="bg-background rounded-lg p-3 text-center">
                  <Settings className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-sm font-medium">{transmissionLabels[car.transmission]}</p>
                </div>
                <div className="bg-background rounded-lg p-3 text-center">
                  <Fuel className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-sm font-medium">{fuelTypeLabels[car.fuelType]}</p>
                </div>
              </div>

              {/* Price */}
              <div className="bg-background rounded-lg p-6 text-center">
                <p className="text-sm text-muted-foreground mb-2">السعر اليومي</p>
                <p className="text-3xl font-bold text-primary">{car.priceDaily} د.إ</p>
              </div>

              {/* Description */}
              {car.descriptionAr && (
                <div>
                  <h3 className="font-semibold mb-2">الوصف</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {car.descriptionAr}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border border-border p-6 shadow-soft h-fit sticky top-24"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">احجز الآن</h2>
                <p className="text-sm text-muted-foreground">املأ البيانات لإتمام الحجز</p>
              </div>
            </div>

            <BookingForm car={car} />
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CarDetailsPage;
