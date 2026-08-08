import { motion } from 'framer-motion';
import { Building, Award, Users, Clock, MapPin, Phone, Shield } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useSEO } from '@/hooks/useSEO';
import { seoContent, getCanonicalUrl } from '@/utils/seoHelpers';
import { SchemaBreadcrumb } from '@/components/seo/SchemaBreadcrumb';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutPage = () => {
  const { t, lang } = useLanguage();

  useSEO({
    title:
      lang === 'ar'
        ? seoContent.about.title
        : 'About Us | AL GENERAL CAR RENTAL Dubai',
    description:
      lang === 'ar'
        ? seoContent.about.description
        : 'Learn about AL GENERAL CAR RENTAL, a leading car rental company in Dubai with premium service.',
    keywords: seoContent.about.keywords,
    canonical: getCanonicalUrl('/about'),
    ogImage: 'https://algenral.vercel.app/logo.png',
  });

  const stats = [
    { icon: Users, label: t.about.statClients, value: '1000+' },
    { icon: Building, label: t.about.statYears, value: '10+' },
    { icon: Award, label: t.about.statCars, value: '50+' },
    { icon: Clock, label: t.about.statHours, value: '24/7' },
  ];

  return (
    <Layout>
      <SchemaBreadcrumb
        items={[
          { name: t.nav.home, url: '/' },
          { name: t.nav.about, url: '/about' },
        ]}
      />

      <section className="page-band py-14 md:py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <p className="section-eyebrow mb-3">{t.about.eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t.about.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{t.about.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <p className="font-display text-3xl tracking-[0.12em] text-foreground">AL GENERAL</p>
              <div className="luxury-divider mx-0 w-14" />
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {t.about.storyTitle}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{t.about.story1}</p>
              <p className="text-muted-foreground leading-relaxed">{t.about.story2}</p>

              <div className="space-y-5 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t.about.insurance}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{t.about.insuranceDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t.about.support}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{t.about.supportDesc}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="relative overflow-hidden rounded-md border border-border/60 bg-card p-6 text-center"
                >
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-primary to-transparent" />
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/40 border-y border-border/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">{t.about.companyInfo}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t.about.address}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {t.about.addressValue}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t.about.phone}</h4>
                  <a
                    href="tel:00971555900747"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    dir="ltr"
                  >
                    00971555900747
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Award className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{t.about.license}</h4>
                  <p className="text-sm text-muted-foreground">
                    {t.about.licenseNo} 1175479
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="section-container">
          <h2 className="text-2xl font-bold text-foreground mb-6">{t.about.map}</h2>
          <div className="overflow-hidden rounded-md border border-border/60">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3607.6693852175417!2d55.35154797538452!3d25.28170487765671!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d9eb53dae23%3A0xb67c5e75a9851be1!2sDar%20Al%20Nahda%20Building%20%23%2041!5e0!3m2!1sen!2seg!4v1770480581306!5m2!1sen!2seg"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Google Maps"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
