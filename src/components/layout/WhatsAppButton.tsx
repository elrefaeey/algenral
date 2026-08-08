import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export const WhatsAppButton = () => {
  const { t, isRTL } = useLanguage();
  const whatsappNumber = '971555900747';
  const message = encodeURIComponent(t.whatsapp.message);

  return (
    <motion.a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed z-50 flex items-center justify-center gap-2 bg-[#25D366] text-white shadow-medium hover:brightness-110 transition-all touch-manipulation bottom-[max(1rem,env(safe-area-inset-bottom))] sm:bottom-6 ${
        isRTL
          ? 'left-[max(1rem,env(safe-area-inset-left))] sm:left-6'
          : 'right-[max(1rem,env(safe-area-inset-right))] sm:right-6'
      } w-12 h-12 sm:w-auto sm:h-auto sm:px-4 sm:py-3 rounded-full sm:rounded-md`}
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.45 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      aria-label={t.whatsapp.label}
    >
      <MessageCircle className="w-5 h-5" />
      <span className="font-medium text-sm hidden sm:inline">{t.whatsapp.label}</span>
    </motion.a>
  );
};
