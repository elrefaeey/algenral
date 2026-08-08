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
  LayoutTemplate,
  Settings,
} from 'lucide-react';
import logoSrc from '@/assets/logo-removebg-preview.png';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getCars, getBookings } from '@/services/firebaseService';
import { Car as CarType, Booking } from '@/types';
import { AdminCars } from '@/components/admin/AdminCars';
import { AdminBookings } from '@/components/admin/AdminBookings';
import { AdminHome } from '@/components/admin/AdminHome';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { useSEO } from '@/hooks/useSEO';
import { toast } from 'sonner';

type TabType = 'dashboard' | 'home' | 'cars' | 'bookings' | 'settings';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [cars, setCars] = useState<CarType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
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

  const tabs = [
    { id: 'dashboard' as TabType, label: 'لوحة التحكم', icon: BarChart3 },
    { id: 'home' as TabType, label: 'الرئيسية', icon: LayoutTemplate },
    { id: 'cars' as TabType, label: 'السيارات', icon: Car },
    { id: 'bookings' as TabType, label: 'الحجوزات', icon: Calendar },
    { id: 'settings' as TabType, label: 'إعدادات الشركة', icon: Settings },
  ];

  const stats = [
    { label: 'إجمالي السيارات', value: cars.length, accent: 'text-primary' },
    { label: 'سيارات متاحة', value: availableCars, accent: 'text-emerald-600' },
    { label: 'إجمالي الحجوزات', value: bookings.length, accent: 'text-foreground' },
    { label: 'قيد المراجعة', value: pendingBookings, accent: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="section-container flex items-center justify-between h-16 md:h-[4.5rem]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-auto max-w-[150px]">
              <img src={logoSrc} alt="AL GENERAL" className="h-full w-full object-contain" />
            </div>
            <div className="hidden sm:block border-r border-border pr-3 min-w-0">
              <p className="font-display text-lg tracking-[0.12em] leading-none">AL GENERAL</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[180px]">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button asChild variant="outline" size="sm" className="rounded-md">
              <Link to="/">
                <Home className="w-4 h-4 sm:ml-2" />
                <span className="hidden sm:inline">الموقع</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden md:flex rounded-md">
              <Link to="/" target="_blank">
                <Eye className="w-4 h-4 ml-2" />
                معاينة
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="rounded-md">
              <LogOut className="w-4 h-4 sm:ml-2" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="section-container py-6 md:py-8">
        <div className="mb-6 md:mb-8">
          <p className="section-eyebrow mb-2">Admin</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">لوحة الإدارة</h1>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-4 mb-6 border-b border-border/60 scrollbar-hide">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors ${
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${active ? 'text-primary' : ''}`} />
                {tab.label}
                {active && (
                  <span className="absolute bottom-0 right-3 left-3 h-px bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="relative overflow-hidden rounded-md border border-border/60 bg-card p-4 md:p-6"
                >
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-primary to-transparent" />
                  <p className={`text-2xl md:text-3xl font-bold ${stat.accent}`}>{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-md border border-border/60 bg-card p-5 md:p-6">
              <h3 className="font-bold text-lg mb-1">إجراءات سريعة</h3>
              <p className="text-sm text-muted-foreground mb-5">انتقل مباشرة لإدارة المحتوى والحجوزات</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Button onClick={() => setActiveTab('cars')} className="btn-gold rounded-md flex-1 sm:flex-none">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة سيارة
                </Button>
                <Button
                  onClick={() => setActiveTab('bookings')}
                  variant="outline"
                  className="rounded-md flex-1 sm:flex-none"
                >
                  <Calendar className="w-4 h-4 ml-2" />
                  عرض الحجوزات
                </Button>
                <Button
                  onClick={() => setActiveTab('home')}
                  variant="outline"
                  className="rounded-md flex-1 sm:flex-none"
                >
                  <LayoutTemplate className="w-4 h-4 ml-2" />
                  إعدادات الرئيسية
                </Button>
                <Button
                  onClick={() => setActiveTab('settings')}
                  variant="outline"
                  className="rounded-md flex-1 sm:flex-none"
                >
                  <Settings className="w-4 h-4 ml-2" />
                  إعدادات الشركة
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'home' && <AdminHome />}
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
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
};

export default AdminPage;
