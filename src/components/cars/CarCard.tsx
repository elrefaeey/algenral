import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Car } from '@/types';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

interface CarCardProps {
  car: Car;
  index?: number;
}

export const CarCard = ({ car, index = 0 }: CarCardProps) => {
  const { t, lang } = useLanguage();

  const transmissionLabel =
    car.transmission === 'automatic' ? t.car.automatic : t.car.manual;
  const title = lang === 'ar' ? car.nameAr : car.name;
  const subtitle = lang === 'ar' ? car.name : car.nameAr;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.5 }}
      className="group h-full"
    >
      <Link
        to={`/cars/${car.id}`}
        className={`block h-full ${!car.available ? 'pointer-events-none opacity-70' : ''}`}
        aria-disabled={!car.available}
      >
        <article className="relative h-full flex flex-col overflow-hidden rounded-md bg-card border border-border/50 transition-all duration-500 hover:border-primary/35 hover:shadow-medium">
          <div className="relative aspect-[4/3] sm:aspect-[5/4] overflow-hidden bg-muted">
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[0]}
                alt={`${title} - ${car.year}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Settings className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent opacity-70" />
            <span
              className={`absolute top-2.5 end-2.5 sm:top-3 sm:end-3 text-[10px] sm:text-[11px] font-medium tracking-wide px-2 sm:px-2.5 py-1 rounded-sm ${
                car.available
                  ? 'bg-background/90 text-foreground backdrop-blur-sm'
                  : 'bg-destructive/90 text-white'
              }`}
            >
              {car.available ? t.car.available : t.car.busy}
            </span>
          </div>

          <div className="p-3.5 sm:p-4 md:p-5 flex-1 flex flex-col gap-2.5 sm:gap-3">
            <div>
              <h3 className="font-bold text-base sm:text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-display tracking-wide">
                {subtitle}
              </p>
            </div>

            <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/60">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-primary" />
                {transmissionLabel}
              </span>
              <span className="text-sm font-semibold text-primary">
                {car.available ? t.car.bookNow : t.car.unavailable}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};
