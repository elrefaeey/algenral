import { Link, useLocation } from 'react-router-dom';
import logoSrc from '@/assets/logo.png';

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/cars', label: 'السيارات' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
];

export const HomeHeader = () => {
  const location = useLocation();

  return (
    <header className="absolute top-0 right-0 left-0 z-[9999] bg-white shadow-md">
      <div className="section-container">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          {/* Logo Section */}
          <div className="flex justify-center py-4 border-b border-gray-100/50">
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
          
          {/* Navigation Section */}
          <div className="flex items-center justify-center py-3">
            <nav className="flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    location.pathname === link.href
                      ? 'bg-primary text-white shadow-lg shadow-primary/40 border-2 border-primary'
                      : 'text-gray-900 hover:bg-gray-50 hover:text-primary hover:shadow-md border-2 border-transparent'
                  }`}
                >
                  {link.label}
                  {location.pathname === link.href && (
                    <div className="absolute inset-0 rounded-full bg-primary -z-10 animate-pulse opacity-20"></div>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Logo */}
          <div className="flex justify-center py-3 border-b border-gray-100/50">
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
          
          {/* Mobile Navigation */}
          <div className="flex items-center justify-center py-2">
            <nav className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                    location.pathname === link.href
                      ? 'bg-primary text-white shadow-md border-2 border-primary'
                      : 'text-gray-900 hover:bg-gray-50 hover:text-primary border-2 border-transparent'
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