import { Link } from 'react-router-dom';
import { Settings, Users, Fuel, ChevronLeft, Calendar } from 'lucide-react';
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
  const fuelLabel = t.car[car.fuelType] ?? car.fuelType;
  const title = lang === 'ar' ? car.nameAr : car.name;
  const subtitle = lang === 'ar' ? car.name : car.nameAr;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.55, ease: 'easeOut' }}
      className="group h-full"
    >
      <Link
        to={`/cars/${car.id}`}
        className={`block h-full touch-manipulation ${!car.available ? 'pointer-events-none opacity-65' : ''}`}
        aria-disabled={!car.available}
      >
        <article className="relative h-full flex flex-col overflow-hidden bg-card border border-border/40 shadow-soft transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-medium">
          {/* Image */}
          <div className="relative aspect-[16/11] overflow-hidden bg-muted">
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[0]}
                alt={`${title} - ${car.year}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Settings className="w-12 h-12 text-muted-foreground/30" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

            {/* Status */}
            <span
              className={`absolute top-3 start-3 text-[10px] sm:text-[11px] font-medium tracking-[0.14em] uppercase px-2.5 py-1 backdrop-blur-sm ${
                car.available
                  ? 'bg-ink/75 text-primary border border-primary/35'
                  : 'bg-destructive/90 text-white border border-destructive/40'
              }`}
            >
              {car.available ? t.car.available : t.car.busy}
            </span>

            {/* Year chip on image */}
            {car.year ? (
              <span className="absolute bottom-3 start-3 inline-flex items-center gap-1.5 text-[11px] text-white/90 tracking-wide">
                <Calendar className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
                {car.year}
              </span>
            ) : null}
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-3.5 p-4 sm:p-5">
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-foreground leading-snug transition-colors duration-300 group-hover:text-primary">
                {title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground font-display tracking-[0.04em]">
                {subtitle}
              </p>
            </div>

            {/* Specs */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
                {transmissionLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
                {car.passengers} {t.car.passengers}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-primary" strokeWidth={1.75} />
                {fuelLabel}
              </span>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-3.5 border-t border-border/70 flex items-center justify-between gap-3">
              <span className="h-px flex-1 max-w-[2.5rem] bg-gradient-to-l from-transparent via-primary/70 to-primary" />
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary tracking-wide">
                {car.available ? t.car.bookNow : t.car.unavailable}
                {car.available && (
                  <ChevronLeft className="w-4 h-4 transition-transform duration-300 ltr:rotate-180 group-hover:-translate-x-0.5 ltr:group-hover:translate-x-0.5" />
                )}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};
