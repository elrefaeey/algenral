import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  Calendar,
  LogOut,
  Plus,
  Eye,
  Home,
  BarChart3,
  Settings,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import logoSrc from '@/assets/logo-removebg-preview.png';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getCars, getBookings } from '@/services/firebaseService';
import { Car as CarType, Booking } from '@/types';
import { AdminCars } from '@/components/admin/AdminCars';
import { AdminBookings } from '@/components/admin/AdminBookings';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminBlog } from '@/components/admin/AdminBlog';
import { useSEO } from '@/hooks/useSEO';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type TabType = 'dashboard' | 'cars' | 'bookings' | 'blog' | 'settings';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [cars, setCars] = useState<CarType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useSEO({
    title: 'Admin Dashboard - AL GENERAL CAR RENTAL',
    description: 'Admin access only',
    noindex: true,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }

    const fetchData = async () => {
      try {
        const [carsData, bookingsData] = await Promise.all([getCars(), getBookings()]);
        setCars(carsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('حدث خطأ في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin, navigate]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('تم تسجيل الخروج');
    } catch {
      toast.error('حدث خطأ');
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [carsData, bookingsData] = await Promise.all([getCars(), getBookings()]);
      setCars(carsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
  const availableCars = cars.filter((c) => c.available).length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed').length;

  const tabs = [
    { id: 'dashboard' as TabType, label: 'لوحة التحكم', icon: BarChart3 },
    { id: 'cars' as TabType, label: 'السيارات', icon: Car },
    { id: 'bookings' as TabType, label: 'الحجوزات', icon: Calendar, badge: pendingBookings },
    { id: 'blog' as TabType, label: 'المدونة / SEO', icon: FileText },
    { id: 'settings' as TabType, label: 'إعدادات الشركة', icon: Settings },
  ];

  const stats = [
    { label: 'إجمالي السيارات', value: cars.length, hint: 'كل الأسطول' },
    { label: 'سيارات متاحة', value: availableCars, hint: 'جاهزة للحجز' },
    { label: 'الحجوزات', value: bookings.length, hint: 'كل الطلبات' },
    { label: 'قيد المراجعة', value: pendingBookings, hint: 'تحتاج إجراء' },
  ];

  const selectTab = (id: TabType) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const activeLabel = tabs.find((t) => t.id === activeTab)?.label ?? 'لوحة الإدارة';

  const SidebarNav = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn('flex h-full flex-col', mobile ? 'bg-ink text-white' : '')}>
      <div className={cn('px-5 py-5 border-b', mobile ? 'border-white/10' : 'border-border/60')}>
        <Link to="/" className="inline-flex" onClick={() => setSidebarOpen(false)}>
          <img
            src={logoSrc}
            alt="AL GENERAL"
            className="h-11 w-auto max-w-[180px] object-contain"
          />
        </Link>
        <p
          className={cn(
            'mt-3 font-display text-sm tracking-[0.16em]',
            mobile ? 'text-primary' : 'text-primary'
          )}
        >
          ADMIN
        </p>
        <p
          className={cn(
            'text-[11px] mt-1 truncate',
            mobile ? 'text-white/50' : 'text-muted-foreground'
          )}
        >
          {user?.email}
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p
          className={cn(
            'px-3 mb-2 text-[10px] font-medium tracking-[0.18em] uppercase',
            mobile ? 'text-white/35' : 'text-muted-foreground'
          )}
        >
          القائمة
        </p>
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm transition-colors touch-manipulation',
                mobile
                  ? active
                    ? 'bg-primary/20 text-white'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                  : active
                    ? 'bg-primary/10 text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <tab.icon
                className={cn('w-4 h-4 shrink-0', active ? 'text-primary' : 'opacity-80')}
              />
              <span className="flex-1 text-start">{tab.label}</span>
              {tab.badge ? (
                <span
                  className={cn(
                    'text-[10px] min-w-[1.25rem] text-center px-1.5 py-0.5 rounded-sm',
                    mobile
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-primary/15 text-primary'
                  )}
                >
                  {tab.badge}
                </span>
              ) : null}
              {active && !mobile && (
                <span className="w-1 h-4 rounded-full bg-primary shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      <div className={cn('px-3 py-4 border-t space-y-1', mobile ? 'border-white/10' : 'border-border/60')}>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={cn(
            'w-full justify-start rounded-sm h-10',
            mobile && 'text-white/80 hover:text-white hover:bg-white/5'
          )}
        >
          <Link to="/" target="_blank" onClick={() => setSidebarOpen(false)}>
            <Eye className="w-4 h-4 ms-2" />
            معاينة الموقع
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className={cn(
            'w-full justify-start rounded-sm h-10',
            mobile && 'text-white/80 hover:text-white hover:bg-white/5'
          )}
        >
          <Link to="/" onClick={() => setSidebarOpen(false)}>
            <Home className="w-4 h-4 ms-2" />
            العودة للموقع
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            'w-full justify-start rounded-sm h-10',
            mobile ? 'text-white/80 hover:text-white hover:bg-white/5' : 'text-destructive hover:text-destructive'
          )}
        >
          <LogOut className="w-4 h-4 ms-2" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar — first in RTL = right side */}
      <aside className="hidden lg:flex w-[260px] xl:w-[280px] shrink-0 sticky top-0 h-screen border-e border-border/60 bg-card flex-col">
        <SidebarNav />
      </aside>

      {/* Mobile drawer overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            aria-label="إغلاق القائمة"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 start-0 w-[280px] max-w-[85vw] shadow-medium animate-in slide-in-from-right duration-200">
            <div className="relative h-full">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 end-3 z-10 p-2 text-white/70 hover:text-white touch-manipulation"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarNav mobile />
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-white/95 backdrop-blur-md lg:bg-background/90">
          <div className="flex items-center justify-between gap-3 h-14 sm:h-16 px-3 sm:px-6">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                type="button"
                className="lg:hidden p-2 -ms-1 text-foreground touch-manipulation"
                onClick={() => setSidebarOpen(true)}
                aria-label="فتح القائمة الجانبية"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="lg:hidden h-9 w-auto max-w-[120px]">
                <img src={logoSrc} alt="AL GENERAL" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="text-xs text-muted-foreground">لوحة الإدارة</p>
                <h1 className="text-sm sm:text-base font-bold text-foreground truncate">
                  {activeLabel}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button asChild variant="outline" size="sm" className="rounded-sm h-9 lg:hidden">
                <Link to="/">
                  <Home className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-sm h-9 lg:hidden">
                <LogOut className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => selectTab('cars')}
                size="sm"
                className="btn-gold rounded-sm h-9 hidden sm:inline-flex"
              >
                <Plus className="w-4 h-4 ms-2" />
                إضافة سيارة
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-3 sm:px-6 py-5 sm:py-6 md:py-8">
          <div className="sm:hidden mb-5">
            <p className="section-eyebrow mb-1">Admin</p>
            <h1 className="text-xl font-bold text-foreground">{activeLabel}</h1>
          </div>

          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5 sm:space-y-6"
            >
              <div className="hidden sm:block mb-2">
                <p className="section-eyebrow mb-1.5">Admin</p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">لوحة التحكم</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  إدارة الأسطول والحجوزات ومحتوى الموقع
                </p>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="relative overflow-hidden rounded-sm border border-border/60 bg-card p-3.5 sm:p-5"
                  >
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-primary to-transparent" />
                    <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs sm:text-sm font-medium text-foreground/80 mt-1">
                      {stat.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{stat.hint}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-sm border border-border/60 bg-card p-4 sm:p-6">
                <h3 className="font-bold text-base sm:text-lg mb-1">إجراءات سريعة</h3>
                <p className="text-sm text-muted-foreground mb-4 sm:mb-5">
                  {confirmedBookings > 0
                    ? `${confirmedBookings} حجز مؤكد · ${pendingBookings} قيد المراجعة`
                    : 'انتقل مباشرة لإدارة المحتوى والحجوزات'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
                  <Button
                    onClick={() => selectTab('cars')}
                    className="btn-gold rounded-sm w-full justify-center"
                  >
                    <Plus className="w-4 h-4 ms-2" />
                    إضافة سيارة
                  </Button>
                  <Button
                    onClick={() => selectTab('bookings')}
                    variant="outline"
                    className="rounded-sm w-full justify-center"
                  >
                    <Calendar className="w-4 h-4 ms-2" />
                    الحجوزات
                    {pendingBookings > 0 ? ` (${pendingBookings})` : ''}
                  </Button>
                  <Button
                    onClick={() => selectTab('blog')}
                    variant="outline"
                    className="rounded-sm w-full justify-center"
                  >
                    <FileText className="w-4 h-4 ms-2" />
                    المدونة
                  </Button>
                  <Button
                    onClick={() => selectTab('settings')}
                    variant="outline"
                    className="rounded-sm w-full justify-center"
                  >
                    <Settings className="w-4 h-4 ms-2" />
                    الشركة
                  </Button>
                </div>
              </div>

              {loading && (
                <p className="text-sm text-muted-foreground text-center py-4">جاري تحديث البيانات…</p>
              )}
            </motion.div>
          )}

          {activeTab === 'cars' && (
            <AdminCars cars={cars} onRefresh={refreshData} loading={loading} />
          )}
          {activeTab === 'bookings' && (
            <AdminBookings
              bookings={bookings}
              cars={cars}
              onRefresh={refreshData}
              loading={loading}
            />
          )}
          {activeTab === 'blog' && <AdminBlog />}
        {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
