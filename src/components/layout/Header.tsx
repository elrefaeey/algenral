import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoSrc from '@/assets/logo-removebg-preview.png';
import { LanguageToggle } from '@/components/layout/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';

export const Header = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/cars', label: t.nav.cars },
    { href: '/blog', label: t.nav.blog },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ];

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed top-0 right-0 left-0 z-[9999] border-b border-border/70 bg-white">
      <div className="section-container">
        <div className="grid h-14 sm:h-16 md:h-[4.5rem] grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4">
          <div className="justify-self-start min-w-0">
            <Link
              to="/"
              className="inline-flex items-center group max-w-full"
              onClick={() => setOpen(false)}
            >
              <div className="h-9 sm:h-11 md:h-14 w-auto max-w-[130px] sm:max-w-[180px] md:max-w-[240px]">
                <img
                  src={logoSrc}
                  alt="AL GENERAL CAR RENTAL"
                  className="h-full w-full object-contain object-start transition-opacity group-hover:opacity-90"
                />
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-0.5 lg:gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`nav-link ${active ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="justify-self-end flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <LanguageToggle />
            <Link
              to="/cars"
              className="hidden md:inline-flex btn-gold px-5 py-2.5 text-sm font-semibold rounded-sm"
            >
              {t.nav.bookNow}
            </Link>
            <button
              type="button"
              className="md:hidden p-2 -me-1 text-foreground touch-manipulation"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white max-h-[calc(100svh-3.5rem)] overflow-y-auto">
          <nav className="section-container py-3 flex flex-col">
            {navLinks.map((link) => {
              const active = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`px-2 py-3.5 text-base font-medium border-b border-border/50 transition-colors ${
                    active ? 'text-primary' : 'text-foreground/85'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/cars"
              onClick={() => setOpen(false)}
              className="mt-4 mb-2 btn-gold text-center px-6 py-3.5 text-sm font-semibold rounded-sm w-full"
            >
              {t.nav.bookNow}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
