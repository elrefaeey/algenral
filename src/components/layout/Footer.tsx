import { Link } from 'react-router-dom';
import { Car, Phone, MapPin, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <Car className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AL GENERAL CAR RENTAL</h3>
                <p className="text-sm text-background/70">الچينرال لتأجير السيارات</p>
              </div>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              متخصصون في تأجير السيارات الفاخرة في دبي. نقدم خدمة احترافية وأسعار تنافسية للأفراد والشركات.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">معلومات التواصل</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-background/80">
                  مكتب 302، هور العنز شرق - دبي - الإمارات
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:00971555900747" className="text-background/80 hover:text-primary transition-colors">
                  00971555900747
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">روابط سريعة</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-background/80 hover:text-primary transition-colors">
                الرئيسية
              </Link>
              <Link to="/cars" className="text-sm text-background/80 hover:text-primary transition-colors">
                السيارات
              </Link>
              <Link to="/about" className="text-sm text-background/80 hover:text-primary transition-colors">
                من نحن
              </Link>
              <Link to="/contact" className="text-sm text-background/80 hover:text-primary transition-colors">
                تواصل معنا
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-right">
            <p className="text-sm text-background/60">
              الرخصة التجارية رقم: 1175479
            </p>
            <p className="text-sm text-background/60 mt-1">
              © 2026 الچينرال لتأجير السيارات. جميع الحقوق محفوظة.
            </p>
          </div>
          
          {/* Admin Lock Icon */}
          <Link
            to="/admin-login"
            className="flex items-center gap-2 text-background/40 hover:text-primary transition-colors text-sm"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
};
