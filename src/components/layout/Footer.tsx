import { Link } from 'react-router-dom';
import { Phone, MapPin, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-ink text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 50% 0%, hsl(36 42% 46% / 0.18), transparent)',
        }}
      />
      <div className="section-container relative py-10 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-4">
            <div>
              <p className="font-display text-3xl tracking-[0.14em] text-white">AL GENERAL</p>
              <p className="text-sm text-white/60 mt-1">{t.brand.tagline}</p>
            </div>
            <div className="luxury-divider mx-0 w-12" />
            <p className="text-sm text-white/65 leading-relaxed max-w-sm">{t.footer.desc}</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white tracking-wide">{t.footer.contactInfo}</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/70">{t.footer.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="tel:00971555900747"
                  className="text-white/70 hover:text-primary transition-colors"
                  dir="ltr"
                >
                  00971555900747
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white tracking-wide">{t.footer.quickLinks}</h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { to: '/', label: t.nav.home },
                { to: '/cars', label: t.nav.cars },
                { to: '/about', label: t.nav.about },
                { to: '/contact', label: t.nav.contact },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-white/70 hover:text-primary transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-start">
            <p className="text-xs text-white/45">
              {t.footer.license} 1175479
            </p>
            <p className="text-xs text-white/45 mt-1">{t.footer.rights}</p>
          </div>
          <Link
            to="/admin-login"
            className="flex items-center gap-2 text-white/30 hover:text-primary transition-colors text-sm"
            aria-label="Admin"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
