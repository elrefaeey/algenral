import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';
import { seoContent, getCanonicalUrl } from '@/utils/seoHelpers';
import { SchemaBreadcrumb } from '@/components/seo/SchemaBreadcrumb';

const ContactPage = () => {
  // SEO Configuration
  useSEO({
    title: seoContent.contact.title,
    description: seoContent.contact.description,
    keywords: seoContent.contact.keywords,
    canonical: getCanonicalUrl('/contact'),
    ogImage: 'https://algenral.vercel.app/src/assets/logo.png'
  });

  return (
    <Layout>
      {/* SEO Schema Components */}
      <SchemaBreadcrumb items={[
        { name: 'الرئيسية', url: '/' },
        { name: 'تواصل معنا', url: '/contact' }
      ]} />

      {/* Hero */}
      <section className="bg-muted/50 py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">تواصل معنا</h1>
            <p className="text-lg text-muted-foreground">
              نخدم عملاءنا في جميع أنحاء دبي والإمارات العربية المتحدة على مدار الساعة
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="max-w-2xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 text-center">الجنرال لتأجير السيارات</h2>
                <p className="text-muted-foreground text-center">
                  يمكنك التواصل معنا عبر أي من الطرق التالية. فريقنا جاهز لخدمتك على مدار الساعة.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">العنوان</h4>
                    <p className="text-muted-foreground">
                      مكتب 302، هور العنز شرق
                      <br />
                      دبي - الإمارات العربية المتحدة
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">الهاتف</h4>
                    <a href="tel:00971555900747" className="text-muted-foreground hover:text-primary transition-colors">
                      00971555900747
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-[#25D366]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">واتساب</h4>
                    <a
                      href="https://wa.me/971555900747"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#25D366] transition-colors"
                    >
                      +971 55 590 0747
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">ساعات العمل</h4>
                    <p className="text-muted-foreground">
                      متاحون على مدار الساعة - 7 أيام في الأسبوع
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-soft">
                  <h3 className="font-bold text-lg mb-4 text-center">روابط سريعة</h3>
                  <div className="space-y-3 text-center">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">الرئيسية</h4>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">السيارات</h4>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">من نحن</h4>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">تواصل معنا</h4>
                    </div>
                  </div>
                </div>

                {/* License Info */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-soft text-center">
                  <h3 className="font-bold text-lg mb-2">الرخصة التجارية</h3>
                  <p className="text-muted-foreground">رقم: 1175479</p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <Button
                asChild
                size="lg"
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white"
              >
                <a
                  href="https://wa.me/971555900747"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="ml-2 w-5 h-5" />
                  تواصل عبر واتساب
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="section-container">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            موقعنا على الخريطة
          </h2>
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.6693852175417!2d55.35154797538452!3d25.28170487765671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d9eb53dae23%3A0xb67c5e75a9851be1!2sDar%20Al%20Nahda%20Building%20%23%2041!5e0!3m2!1sen!2seg!4v1770480581306!5m2!1sen!2seg"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Google Maps"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
