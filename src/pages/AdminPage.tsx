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
} from 'lucide-react';
import logoSrc from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getCars, getBookings } from '@/services/firebaseService';
import { Car as CarType, Booking } from '@/types';
import { AdminCars } from '@/components/admin/AdminCars';
import { AdminBookings } from '@/components/admin/AdminBookings';
import { toast } from 'sonner';

type TabType = 'dashboard' | 'cars' | 'bookings';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [cars, setCars] = useState<CarType[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }

    const fetchData = async () => {
      try {
        const [carsData, bookingsData] = await Promise.all([
          getCars(),
          getBookings(),
        ]);
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
    } catch (error) {
      toast.error('حدث خطأ');
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [carsData, bookingsData] = await Promise.all([
        getCars(),
        getBookings(),
      ]);
      setCars(carsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const availableCars = cars.filter(c => c.available).length;

  const tabs = [
    { id: 'dashboard' as TabType, label: 'لوحة التحكم', icon: BarChart3 },
    { id: 'cars' as TabType, label: 'السيارات', icon: Car },
    { id: 'bookings' as TabType, label: 'الحجوزات', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="section-container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="logo-container w-8 h-8 sm:w-10 sm:h-10">
              <img
                src={logoSrc}
                alt="شعار المكتب"
                className="logo-image"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-foreground text-sm sm:text-base">لوحة الإدارة</h1>
              <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="btn-gold">
              <Link to="/">
                <Home className="w-4 h-4 ml-2" />
                <span className="hidden sm:inline">الصفحة الرئيسية</span>
                <span className="sm:hidden">الرئيسية</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden md:flex">
              <Link to="/" target="_blank">
                <Eye className="w-4 h-4 ml-2" />
                عرض الموقع
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 ml-2" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="section-container py-6">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap flex-shrink-0 ${activeTab === tab.id ? 'btn-gold' : ''}`}
              size="sm"
            >
              <tab.icon className="w-4 h-4 ml-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{cars.length}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">إجمالي السيارات</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{availableCars}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">سيارات متاحة</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{bookings.length}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">إجمالي الحجوزات</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xl sm:text-2xl font-bold text-foreground">{pendingBookings}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">حجوزات قيد المراجعة</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border shadow-soft">
              <h3 className="font-bold text-lg mb-4">إجراءات سريعة</h3>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Button asChild className="btn-gold flex-1 sm:flex-none">
                  <Link to="/">
                    <Home className="w-4 h-4 ml-2" />
                    العودة للصفحة الرئيسية
                  </Link>
                </Button>
                <Button onClick={() => setActiveTab('cars')} variant="outline" className="flex-1 sm:flex-none">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة سيارة
                </Button>
                <Button onClick={() => setActiveTab('bookings')} variant="outline" className="flex-1 sm:flex-none">
                  <Calendar className="w-4 h-4 ml-2" />
                  عرض الحجوزات
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'cars' && (
          <AdminCars cars={cars} onRefresh={refreshData} loading={loading} />
        )}

        {activeTab === 'bookings' && (
          <AdminBookings bookings={bookings} cars={cars} onRefresh={refreshData} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default AdminPage;
