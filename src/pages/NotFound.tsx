import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSEO } from '@/hooks/useSEO';

const NotFound = () => {
  const location = useLocation();
  const { t, lang } = useLanguage();

  useSEO({
    title: `${t.notFound.title} | AL GENERAL CAR RENTAL`,
    description: t.notFound.desc,
    noindex: true,
    lang,
  });

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center space-y-4">
        <p className="font-display text-6xl tracking-[0.2em] text-primary">404</p>
        <h1 className="text-2xl font-bold text-foreground">{t.notFound.title}</h1>
        <p className="text-muted-foreground">{t.notFound.desc}</p>
        <Link
          to="/"
          className="inline-block btn-gold px-6 py-3 rounded-md text-sm font-semibold mt-2"
        >
          {t.notFound.home}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
