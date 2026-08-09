import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageCircle, Lock, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { defaultSiteSettings, SiteSettings } from '@/types';
import { getSiteSettings } from '@/services/firebaseService';
import logoSrc from '@/assets/logo-removebg-preview.png';

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

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/cars', label: t.nav.cars },
    { to: '/blog', label: t.nav.blog },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-white pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      {/* Atmosphere */}
      <div
        className="absolute inset-0 pointer-events-none opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 0%, hsl(var(--primary) / 0.2), transparent 70%), radial-gradient(ellipse 40% 35% at 100% 100%, hsl(var(--primary) / 0.08), transparent)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="section-container relative pt-12 sm:pt-16 md:pt-20 pb-7 sm:pb-9">
        {/* Brand — top center */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
          <Link to="/" className="inline-flex justify-center group">
            <img
              src={logoSrc}
              alt="AL GENERAL CAR RENTAL — الچينرال لتأجير السيارات"
              className="h-[4.25rem] sm:h-20 md:h-24 w-auto max-w-[280px] sm:max-w-[360px] md:max-w-[420px] object-contain transition-opacity group-hover:opacity-90"
            />
          </Link>
          <div className="mt-5 mb-4 h-px w-16 bg-gradient-to-l from-transparent via-primary to-transparent" />
          <p className="text-sm sm:text-[0.95rem] text-white/55 leading-relaxed">
            {t.footer.desc}
          </p>
        </div>

        {/* Content grid */}
        <div className="mt-10 sm:mt-12 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10 pt-8 sm:pt-10 border-t border-white/10">
          {/* Contact */}
          <div className="flex flex-col items-center md:items-start text-center md:text-start">
            <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-primary mb-5">
              {t.footer.contactInfo}
            </h4>
            <ul className="space-y-4 w-full max-w-xs md:max-w-none">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-primary/30 bg-primary/10">
                  <MapPin className="w-4 h-4 text-primary" strokeWidth={1.75} />
                </span>
                <span className="text-sm text-white/70 leading-relaxed pt-1.5">{address}</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary/30 bg-primary/10">
                  <Phone className="w-4 h-4 text-primary" strokeWidth={1.75} />
                </span>
                <a
                  href={`tel:${phone}`}
                  className="text-sm text-white/70 hover:text-primary transition-colors touch-manipulation"
                  dir="ltr"
                >
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-primary/30 bg-primary/10">
                  <MessageCircle className="w-4 h-4 text-primary" strokeWidth={1.75} />
                </span>
                <a
                  href={`https://wa.me/${whatsappDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-primary transition-colors touch-manipulation"
                >
                  {t.whatsapp.label}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-primary mb-5">
              {t.footer.quickLinks}
            </h4>
            <nav className="flex flex-col items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group relative text-sm text-white/70 hover:text-white transition-colors touch-manipulation py-1.5 px-2"
                >
                  {link.label}
                  <span className="absolute bottom-0 inset-x-2 h-px origin-center scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA column */}
          <div className="flex flex-col items-center md:items-end text-center md:text-end">
            <h4 className="text-[11px] font-medium tracking-[0.2em] uppercase text-primary mb-5">
              {t.nav.bookNow}
            </h4>
            <p className="text-sm text-white/50 leading-relaxed max-w-[240px] mb-5">
              {lang === 'ar'
                ? 'احجز سيارتك الآن عبر واتساب — خدمة على مدار الساعة.'
                : 'Book your car now on WhatsApp — available around the clock.'}
            </p>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full max-w-[240px]">
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 px-4 bg-primary text-primary-foreground text-sm font-semibold transition-all hover:bg-gold-dark touch-manipulation"
              >
                <MessageCircle className="w-4 h-4" />
                {t.whatsapp.label}
              </a>
              <Link
                to="/cars"
                className="inline-flex items-center justify-center gap-1.5 h-11 px-4 border border-white/20 text-sm text-white/85 hover:border-primary/50 hover:text-primary transition-colors touch-manipulation"
              >
                {t.nav.cars}
                <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-white/10 relative">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <p className="text-[11px] sm:text-xs text-white/40">
              {t.footer.license} {settings.licenseNumber || '1175479'}
            </p>
            <p className="text-[11px] sm:text-xs text-white/40">{t.footer.rights}</p>
            <p className="text-[11px] sm:text-xs text-white/45 mt-0.5">
              {lang === 'ar' ? 'الموقع من تنفيذ' : 'Website by'}{' '}
              <a
                href="https://www.top1markting.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#5EC8FF] hover:text-[#9ADFFF] transition-colors touch-manipulation"
              >
                Top1Markting
              </a>
            </p>
          </div>
          <Link
            to="/admin-login"
            className="absolute end-0 bottom-0 text-white/15 hover:text-primary transition-colors touch-manipulation p-1"
            aria-label="Admin"
          >
            <Lock className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
