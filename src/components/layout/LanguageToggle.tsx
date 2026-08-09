import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle = () => {
  const { lang, setLang } = useLanguage();
  const isArabic = lang === 'ar';

  return (
    <div
      dir="ltr"
      className="relative flex h-8 w-[68px] sm:h-9 sm:w-[72px] shrink-0 items-center rounded-full border border-foreground/25 bg-[#EDEDED] p-0.5"
      role="group"
      aria-label="Language switcher"
    >
      <span
        className={`pointer-events-none absolute top-0.5 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-ink shadow-sm transition-transform duration-300 ease-out ${
          isArabic ? 'translate-x-7 sm:translate-x-8' : 'translate-x-0'
        }`}
        style={{ left: 2 }}
      />
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`relative z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide transition-colors touch-manipulation ${
          !isArabic ? 'text-white' : 'text-[#6B7280]'
        }`}
        aria-pressed={!isArabic}
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('ar')}
        className={`relative z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-sm font-bold transition-colors touch-manipulation ${
          isArabic ? 'text-white' : 'text-[#6B7280]'
        }`}
        aria-pressed={isArabic}
        aria-label="العربية"
      >
        ع
      </button>
    </div>
  );
};
