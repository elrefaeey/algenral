import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageCircle, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { defaultSiteSettings, SiteSettings } from '@/types';
import { getSiteSettings } from '@/services/firebaseService';

export const Footer = () => {
  const { t, lang } = useLanguage();
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);

  useEffect(() => {
    getSiteSettings()
      .then((data) => setSettings({ ...defaultSiteSettings, ...data }))
      .catch(() => setSettings(defaultSiteSettings));
  }, []);

  const address =
    lang === 'ar'
      ? settings.addressAr || t.footer.address
      : settings.address || t.footer.address;
  const phone = settings.phone || '00971555900747';
  const whatsappDigits = (settings.whatsapp || '+971555900747').replace(/[^\d]/g, '');
  const companyLabel =
    lang === 'ar'
      ? settings.companyNameAr || t.brand.tagline
      : settings.companyName || 'AL GENERAL CAR RENTAL';

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/cars', label: t.nav.cars },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="bg-ink text-white relative overflow-hidden pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 0%, hsl(36 42% 46% / 0.16), transparent)',
        }}
      />

      <div className="section-container relative pt-10 pb-8 sm:py-14 md:py-16">
        {/* Brand — centered on mobile */}
        <div className="text-center md:text-start max-w-xl mx-auto md:mx-0 mb-8 sm:mb-10">
          <p className="font-display text-2xl sm:text-3xl tracking-[0.14em] text-white">
            AL GENERAL
          </p>
          <p className="text-xs sm:text-sm text-white/55 mt-1.5">{companyLabel}</p>
          <div className="luxury-divider mt-4 md:mx-0" />
          <p className="text-sm text-white/65 leading-relaxed mt-4 max-w-md mx-auto md:mx-0">
            {t.footer.desc}
          </p>
        </div>

        {/* Contact + links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 md:gap-12 md:grid-cols-2">
          <div className="space-y-4 text-center sm:text-start">
            <h4 className="text-xs font-medium tracking-[0.16em] uppercase text-primary">
              {t.footer.contactInfo}
            </h4>
            <div className="space-y-3.5">
              <div className="flex items-start justify-center sm:justify-start gap-2.5 text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/70 leading-relaxed max-w-xs">{address}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5 text-sm">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href={`tel:${phone}`}
                  className="text-white/70 hover:text-primary transition-colors touch-manipulation"
                  dir="ltr"
                >
                  {phone}
                </a>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2.5 text-sm">
                <MessageCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-primary transition-colors touch-manipulation"
                >
                  {t.whatsapp.label}
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-center sm:text-start">
            <h4 className="text-xs font-medium tracking-[0.16em] uppercase text-primary">
              {t.footer.quickLinks}
            </h4>
            {/* Horizontal chips on phone, stacked on larger */}
            <nav className="flex flex-wrap justify-center sm:justify-start gap-2 sm:flex-col sm:gap-2.5">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-white/70 hover:text-primary transition-colors touch-manipulation px-3 py-2 sm:px-0 sm:py-0 border border-white/10 sm:border-0 rounded-sm sm:rounded-none"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-white/10 flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:items-center">
          <div className="text-center sm:text-start space-y-1 order-2 sm:order-1">
            <p className="text-[11px] sm:text-xs text-white/40">
              {t.footer.license} {settings.licenseNumber || '1175479'}
            </p>
            <p className="text-[11px] sm:text-xs text-white/40">{t.footer.rights}</p>
          </div>
          <Link
            to="/admin-login"
            className="order-1 sm:order-2 flex items-center gap-2 text-white/25 hover:text-primary transition-colors text-xs touch-manipulation"
            aria-label="Admin"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
