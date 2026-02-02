import { Link } from 'react-router-dom';
import { Settings, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car } from '@/types';
import { motion } from 'framer-motion';

interface CarCardProps {
  car: Car;
  index?: number;
}

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

export const CarCard = ({ car, index = 0 }: CarCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-soft hover:shadow-medium hover:border-primary/20 transition-all duration-300 group h-full flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
        {car.images && car.images.length > 0 ? (
          <img
            src={car.images[0]}
            alt={car.nameAr}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Settings className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground/30" />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Availability Badge */}
        <Badge
          className={`absolute top-3 right-3 text-[10px] md:text-xs px-2.5 py-1 md:px-3 md:py-1.5 font-medium shadow-lg ${
            car.available
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : 'bg-destructive hover:bg-destructive/90 text-white'
          }`}
        >
          {car.available ? 'متاحة' : 'مشغولة'}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-3 md:p-5 space-y-3 md:space-y-4 flex-1 flex flex-col">
        {/* Name */}
        <div className="min-h-[3rem] md:min-h-[4rem] flex flex-col justify-center">
          <h3 className="font-bold text-base md:text-xl text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
            {car.nameAr}
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">{car.name}</p>
        </div>

        {/* Specs */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1.5 bg-muted/50 rounded-full px-3 py-1.5">
            <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary flex-shrink-0" />
            <span className="whitespace-nowrap font-medium text-xs md:text-sm">{transmissionLabels[car.transmission]}</span>
          </div>
        </div>

        {/* Price */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 md:p-4 text-center border border-primary/10">
          <p className="text-xs md:text-sm text-muted-foreground mb-1.5 font-medium">السعر اليومي</p>
          <p className="font-bold text-lg md:text-2xl text-primary">{car.priceDaily} <span className="text-sm md:text-base">د.إ</span></p>
        </div>

        {/* CTA */}
        <Button 
          asChild 
          className="w-full btn-gold text-xs md:text-base py-2.5 md:py-3 h-auto mt-auto font-semibold shadow-md hover:shadow-lg transition-all" 
          disabled={!car.available}
        >
          <Link to={`/cars/${car.id}`} className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 md:w-5 md:h-5" />
            <span>{car.available ? 'احجز الآن' : 'غير متاحة'}</span>
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};
