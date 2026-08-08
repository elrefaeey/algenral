import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { Lang, translations, TranslationKeys } from '@/i18n/translations';

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: TranslationKeys;
  isRTL: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'al-general-lang';

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'ar';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'ar' || saved === 'en') return saved;
  return 'ar';
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);

  const setLang = (next: Lang) => {
    setLangState(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar');

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang,
      t: translations[lang] as TranslationKeys,
      isRTL: lang === 'ar',
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
};
