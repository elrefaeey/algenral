import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Check,
  X,
  Eye,
  Loader2,
  Calendar,
  User,
  Phone,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Booking, Car } from '@/types';
import { updateBooking, updateCar, deleteBooking } from '@/services/firebaseService';
import { toast } from 'sonner';

interface AdminBookingsProps {
  bookings: Booking[];
  cars: Car[];
  onRefresh: () => void;
  loading: boolean;
}

const statusLabels = {
  pending: 'قيد المراجعة',
  confirmed: 'مؤكد',
  cancelled: 'ملغي',
  completed: 'مكتمل',
};

const statusStyles = {
  pending: 'bg-primary/10 text-primary border-primary/20',
  confirmed: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  completed: 'bg-muted text-muted-foreground border-border',
};

export const AdminBookings = ({ bookings, cars, onRefresh, loading }: AdminBookingsProps) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings =
    statusFilter === 'all' ? bookings : bookings.filter((b) => b.status === statusFilter);

  const handleStatusChange = async (booking: Booking, newStatus: Booking['status']) => {
    try {
      await updateBooking(booking.id, { status: newStatus });

      if (newStatus === 'confirmed') {
        const car = cars.find((c) => c.id === booking.carId);
        if (car) await updateCar(car.id, { available: false });
      }

      if (newStatus === 'completed' || newStatus === 'cancelled') {
        const car = cars.find((c) => c.id === booking.carId);
        if (car) await updateCar(car.id, { available: true });
      }

      toast.success('تم تحديث حالة الحجز');
      onRefresh();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('فشل تحديث الحالة');
    }
  };

  const handleDelete = async () => {
    if (!bookingToDelete) return;

    try {
      await deleteBooking(bookingToDelete.id);
      toast.success('تم حذف الحجز بنجاح');
      onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('فشل حذف الحجز');
    } finally {
      setIsDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const openDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <p className="section-eyebrow mb-2">Bookings</p>
          <h2 className="text-xl sm:text-2xl font-bold">إدارة الحجوزات</h2>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-52 rounded-md">
            <SelectValue placeholder="فلترة حسب الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحجوزات</SelectItem>
            <SelectItem value="pending">قيد المراجعة</SelectItem>
            <SelectItem value="confirmed">مؤكدة</SelectItem>
            <SelectItem value="cancelled">ملغية</SelectItem>
            <SelectItem value="completed">مكتملة</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-md border border-border/60 bg-card p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-md bg-muted border border-border/50 flex items-center justify-center">
            <Calendar className="w-7 h-7 text-primary/70" />
          </div>
          <h3 className="text-lg font-semibold mb-2">لا توجد حجوزات</h3>
          <p className="text-muted-foreground text-sm">ستظهر الحجوزات هنا عند استلامها</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-md border border-border/60 bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                <div className="flex-1 space-y-2.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded-sm border border-border/50">
                      {booking.bookingNumber}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-sm border ${statusStyles[booking.status]}`}
                    >
                      {statusLabels[booking.status]}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">{booking.carName}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      {booking.customerName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      {booking.customerPhone}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    <span>
                      {format(new Date(booking.pickupDate), 'dd/MM/yyyy', { locale: ar })}
                    </span>
                    <span className="text-primary/50">—</span>
                    <span>
                      {format(new Date(booking.dropoffDate), 'dd/MM/yyyy', { locale: ar })}
                    </span>
                    <span className="text-xs">({booking.totalDays} يوم)</span>
                  </div>
                </div>

                <div className="text-right lg:min-w-[100px]">
                  <p className="text-xl font-bold text-primary">{booking.totalPrice} د.إ</p>
                  <p className="text-xs text-muted-foreground">{booking.pricePerDay} د.إ / يوم</p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDetails(booking)}
                    className="h-9 w-9 rounded-md"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {booking.status === 'pending' && (
                    <>
                      <Button
                        size="icon"
                        className="h-9 w-9 rounded-md bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleStatusChange(booking, 'confirmed')}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-9 w-9 rounded-md"
                        onClick={() => handleStatusChange(booking, 'cancelled')}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-md"
                      onClick={() => handleStatusChange(booking, 'completed')}
                    >
                      إكمال
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-md"
                    onClick={() => {
                      setBookingToDelete(booking);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <DialogTitle>تفاصيل الحجز</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs bg-muted px-2.5 py-1 rounded-sm border border-border/50">
                  {selectedBooking.bookingNumber}
                </span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-sm border ${statusStyles[selectedBooking.status]}`}
                >
                  {statusLabels[selectedBooking.status]}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { label: 'السيارة', value: selectedBooking.carName },
                  { label: 'العميل', value: selectedBooking.customerName },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-left">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">الهاتف</span>
                  <a
                    href={`tel:${selectedBooking.customerPhone}`}
                    className="font-medium text-primary"
                  >
                    {selectedBooking.customerPhone}
                  </a>
                </div>
                {selectedBooking.customerEmail && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">البريد</span>
                    <span className="font-medium">{selectedBooking.customerEmail}</span>
                  </div>
                )}

                <div className="border-t border-border/60 pt-3 space-y-2">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">الاستلام</span>
                    <span className="font-medium">
                      {format(new Date(selectedBooking.pickupDate), 'dd/MM/yyyy', { locale: ar })} —{' '}
                      {selectedBooking.pickupTime}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">التسليم</span>
                    <span className="font-medium">
                      {format(new Date(selectedBooking.dropoffDate), 'dd/MM/yyyy', { locale: ar })} —{' '}
                      {selectedBooking.dropoffTime}
                    </span>
                  </div>
                </div>

                <div className="rounded-md border border-primary/20 bg-primary/5 p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">عدد الأيام</span>
                    <span className="font-medium">{selectedBooking.totalDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">سعر اليوم</span>
                    <span className="font-medium">{selectedBooking.pricePerDay} د.إ</span>
                  </div>
                  <div className="flex justify-between border-t border-primary/20 pt-2">
                    <span className="font-bold">الإجمالي</span>
                    <span className="font-bold text-primary text-lg">
                      {selectedBooking.totalPrice} د.إ
                    </span>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="border-t border-border/60 pt-3">
                    <span className="text-muted-foreground block mb-1">ملاحظات</span>
                    <p className="text-sm leading-relaxed">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  variant="outline"
                  className="rounded-md"
                  onClick={() => {
                    const message = `مرحباً ${selectedBooking.customerName}، بخصوص حجزك رقم ${selectedBooking.bookingNumber}`;
                    window.open(
                      `https://wa.me/${selectedBooking.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
                      '_blank'
                    );
                  }}
                >
                  تواصل واتساب
                </Button>
                <Button onClick={() => setIsDialogOpen(false)} className="btn-gold rounded-md">
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف الحجز رقم "{bookingToDelete?.bookingNumber}"؟ سيتم حذف جميع بيانات
              هذا الحجز نهائياً من النظام.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-md">إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-md"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
