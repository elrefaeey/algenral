import { Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export const EmptyState = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-md bg-muted border border-border/60 flex items-center justify-center mb-6">
        <Car className="w-10 h-10 text-primary/70" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{t.empty.title}</h3>
      <p className="text-muted-foreground max-w-md leading-relaxed">{t.empty.desc}</p>
    </motion.div>
  );
};
