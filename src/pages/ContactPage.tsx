import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useSEO } from '@/hooks/useSEO';
import { seoContent, getCanonicalUrl } from '@/utils/seoHelpers';
import { SchemaBreadcrumb } from '@/components/seo/SchemaBreadcrumb';
import { useLanguage } from '@/contexts/LanguageContext';

const ContactPage = () => {
  const { t, lang } = useLanguage();

  useSEO({
    title:
      lang === 'ar'
        ? seoContent.contact.title
        : 'Contact Us | AL GENERAL CAR RENTAL Dubai',
    description:
      lang === 'ar'
        ? seoContent.contact.description
        : 'Contact AL GENERAL CAR RENTAL in Dubai. 24/7 support and airport delivery.',
    keywords: seoContent.contact.keywords,
    canonical: getCanonicalUrl('/contact'),
    ogImage: 'https://algenral.vercel.app/logo.png',
  });

  return (
    <Layout>
      <SchemaBreadcrumb
        items={[
          { name: t.nav.home, url: '/' },
          { name: t.nav.contact, url: '/contact' },
        ]}
      />

      <section className="page-band py-14 md:py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <p className="section-eyebrow mb-3">{t.contact.eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.contact.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{t.contact.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <p className="font-display text-3xl tracking-[0.12em] text-foreground mb-2">
                  AL GENERAL
                </p>
                <h2 className="text-xl font-bold text-foreground mb-3">{t.brand.tagline}</h2>
                <p className="text-muted-foreground">{t.contact.intro}</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 pb-6 border-b border-border/60">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{t.contact.address}</h4>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {t.contact.addressValue}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-6 border-b border-border/60">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{t.contact.phone}</h4>
                    <a
                      href="tel:00971555900747"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      dir="ltr"
                    >
                      00971555900747
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-6 border-b border-border/60">
                  <MessageCircle className="w-5 h-5 text-[#25D366] flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{t.contact.whatsapp}</h4>
                    <a
                      href="https://wa.me/971555900747"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#25D366] transition-colors"
                      dir="ltr"
                    >
                      +971 55 590 0747
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{t.contact.hours}</h4>
                    <p className="text-muted-foreground">{t.contact.hoursValue}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-4">
                  {t.contact.license} 1175479
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-md"
                  >
                    <a
                      href="https://wa.me/971555900747"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="ms-2 w-5 h-5" />
                      {t.contact.waCta}
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="btn-outline-gold rounded-md">
                    <Link to="/cars">{t.contact.browseCars}</Link>
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-foreground">{t.contact.map}</h2>
              <div className="overflow-hidden rounded-md border border-border/60 h-[420px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.6693852175417!2d55.35154797538452!3d25.28170487765671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d9eb53dae23%3A0xb67c5e75a9851be1!2sDar%20Al%20Nahda%20Building%20%23%2041!5e0!3m2!1sen!2seg!4v1770480581306!5m2!1sen!2seg"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Google Maps"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
