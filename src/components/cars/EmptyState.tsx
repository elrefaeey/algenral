import { Car } from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Car className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        لا توجد سيارات حالياً
      </h3>
      <p className="text-muted-foreground max-w-md">
        سيتم إضافة السيارات قريباً. يرجى التواصل معنا عبر واتساب للاستفسار عن السيارات المتاحة.
      </p>
    </motion.div>
  );
};
