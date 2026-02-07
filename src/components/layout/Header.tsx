import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logoSrc from '@/assets/logo.png';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/cars', label: 'السيارات' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
];

export const Header = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-white shadow-md">
      <div className="section-container">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Logo Section - Pure White Background */}
          <div className="flex justify-center py-4 bg-white shadow-sm">
            <Link to="/" className="hover:opacity-90 transition-all duration-300 hover:scale-105">
              <div className="logo-container h-16 w-auto min-w-[200px] max-w-[280px] drop-shadow-sm">
                <img
                  src={logoSrc}
                  alt="AL GENERAL CAR RENTAL"
                  className="logo-image"
                />
              </div>
            </Link>
          </div>
          
          {/* Navigation Section - White Background */}
          <div className="flex items-center justify-center py-3 bg-white border-t border-gray-100">
            <nav className="flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    location.pathname === link.href
                      ? 'bg-primary text-white shadow-lg shadow-primary/40 border-2 border-primary'
                      : 'text-gray-900 hover:bg-white/90 hover:text-primary hover:shadow-md backdrop-blur-sm border-2 border-transparent'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-primary/90 -z-10 animate-pulse opacity-20"></div>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Logo - Pure White Background */}
          <div className="flex justify-center py-3 bg-white shadow-sm">
            <Link to="/" className="hover:opacity-90 transition-all duration-300">
              <div className="logo-container h-12 w-auto min-w-[140px] max-w-[180px] drop-shadow-sm">
                <img
                  src={logoSrc}
                  alt="AL GENERAL CAR RENTAL"
                  className="logo-image"
                />
              </div>
            </Link>
          </div>
          
          {/* Mobile Navigation - White Background */}
          <div className="flex items-center justify-center py-2 bg-white border-t border-gray-100">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    location.pathname === link.href
                      ? 'bg-primary text-white shadow-md border-2 border-primary'
                      : 'text-gray-900 hover:bg-white/90 hover:text-primary backdrop-blur-sm border-2 border-transparent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
