import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';

const ContactPage = () => {
  return (
    <Layout>
      {/* Back Button */}
      <div className="section-container pt-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>الصفحة الرئيسية</span>
          </Link>
        </motion.div>
      </div>

      {/* Hero */}
      <section className="bg-muted/50 py-16">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">معلومات التواصل</h1>
            <p className="text-lg text-muted-foreground">
              نحن هنا لمساعدتك. تواصل معنا في أي وقت
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
    </Layout>
  );
};

export default ContactPage;
