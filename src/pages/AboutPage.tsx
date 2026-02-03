import { motion } from 'framer-motion';
import { Building, Award, Users, Clock, MapPin, Phone, Mail, Shield, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useSEO } from '@/hooks/useSEO';
import { seoContent, getCanonicalUrl } from '@/utils/seoHelpers';
import { SchemaBreadcrumb } from '@/components/seo/SchemaBreadcrumb';

const stats = [
  { icon: Users, label: 'عميل سعيد', value: '1000+' },
  { icon: Building, label: 'سنوات خبرة', value: '10+' },
  { icon: Award, label: 'سيارة', value: '50+' },
  { icon: Clock, label: 'ساعة خدمة', value: '24/7' },
];

const AboutPage = () => {
  // SEO Configuration
  useSEO({
    title: seoContent.about.title,
    description: seoContent.about.description,
    keywords: seoContent.about.keywords,
    canonical: getCanonicalUrl('/about'),
    ogImage: 'https://algenral.vercel.app/src/assets/logo.png'
  });

  return (
    <Layout>
      {/* SEO Schema Components */}
      <SchemaBreadcrumb items={[
        { name: 'الرئيسية', url: '/' },
        { name: 'من نحن', url: '/about' }
      ]} />

      {/* Hero */}
      <section className="bg-muted/50 py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">من نحن</h1>
            <p className="text-lg text-muted-foreground">
              الچينرال لتأجير السيارات - شريكك الموثوق في عالم تأجير السيارات الفاخرة
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-foreground">
                خبرة تمتد لسنوات في خدمة عملائنا
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                نحن شركة الچينرال لتأجير السيارات، متخصصون في تأجير السيارات في دبي. 
                نقدم مجموعة متنوعة من السيارات مع خدمة احترافية وأسعار تنافسية للأفراد والشركات.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                نسعى دائماً لتقديم أفضل تجربة لعملائنا من خلال توفير أحدث الموديلات 
                وضمان جودة الخدمة والالتزام بالمواعيد.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">تأمين شامل</h4>
                    <p className="text-sm text-muted-foreground">
                      جميع سياراتنا مؤمنة تأميناً شاملاً لراحة بالك
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">خدمة 24/7</h4>
                    <p className="text-sm text-muted-foreground">
                      فريق الدعم متواجد على مدار الساعة لخدمتك
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-card rounded-xl p-6 text-center border border-border shadow-soft"
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-7 h-7 text-primary" />
                  </div>
                  <p className="text-3xl font-bold text-primary mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-16 bg-muted/50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl p-8 border border-border shadow-soft"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              معلومات الشركة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">العنوان</h4>
                  <p className="text-sm text-muted-foreground">
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
                  <a href="tel:00971555900747" className="text-sm text-muted-foreground hover:text-primary">
                    00971555900747
                  </a>
                  <p className="text-sm text-muted-foreground">
                    واتساب: +971 55 590 0747
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">الرخصة التجارية</h4>
                  <p className="text-sm text-muted-foreground">
                    رقم: 1175479
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
