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
      className={`fixed bottom-6 z-50 flex items-center gap-2.5 bg-[#25D366] text-white px-4 py-3 rounded-md shadow-medium hover:brightness-110 transition-all ${
        isRTL ? 'left-6' : 'right-6'
      }`}
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
