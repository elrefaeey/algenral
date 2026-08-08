import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export const FaqSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 sm:py-16 md:py-20 border-t border-border/60">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <p className="section-eyebrow mb-2 sm:mb-3 text-center">{t.faq.eyebrow}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center text-balance mb-8 sm:mb-10">
            {t.faq.title}
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {t.faq.items.map((item, index) => (
              <motion.details
                key={item.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.04, 0.24) }}
                className="group border border-border/60 bg-card/60 open:bg-card open:shadow-soft"
              >
                <summary className="cursor-pointer list-none px-4 sm:px-5 py-4 sm:py-5 font-semibold text-foreground flex items-center justify-between gap-3 touch-manipulation">
                  <span className="text-sm sm:text-base text-start">{item.q}</span>
                  <span className="text-primary text-xl leading-none group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </motion.details>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
