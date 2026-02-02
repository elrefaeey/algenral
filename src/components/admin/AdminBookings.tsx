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
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Booking, Car } from '@/types';
import { updateBooking, updateCar } from '@/services/firebaseService';
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

const statusColors = {
  pending: 'bg-blue-600',
  confirmed: 'bg-emerald-500',
  cancelled: 'bg-destructive',
  completed: 'bg-blue-500',
};

export const AdminBookings = ({ bookings, cars, onRefresh, loading }: AdminBookingsProps) => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = statusFilter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === statusFilter);

  const handleStatusChange = async (booking: Booking, newStatus: Booking['status']) => {
    try {
      await updateBooking(booking.id, { status: newStatus });

      // If confirmed, set car as occupied
      if (newStatus === 'confirmed') {
        const car = cars.find((c) => c.id === booking.carId);
        if (car) {
          await updateCar(car.id, { available: false });
        }
      }

      // If completed or cancelled, set car as available
      if (newStatus === 'completed' || newStatus === 'cancelled') {
        const car = cars.find((c) => c.id === booking.carId);
        if (car) {
          await updateCar(car.id, { available: true });
        }
      }

      toast.success('تم تحديث حالة الحجز');
      onRefresh();
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('فشل تحديث الحالة');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">إدارة الحجوزات</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
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

      {/* Bookings List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">لا توجد حجوزات</h3>
          <p className="text-muted-foreground">ستظهر الحجوزات هنا عند استلامها</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Booking Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                      {booking.bookingNumber}
                    </span>
                    <Badge className={statusColors[booking.status]}>
                      {statusLabels[booking.status]}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground">{booking.carName}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {booking.customerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {booking.customerPhone}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(booking.pickupDate), 'dd/MM/yyyy', { locale: ar })}
                    </span>
                    <span>→</span>
                    <span>
                      {format(new Date(booking.dropoffDate), 'dd/MM/yyyy', { locale: ar })}
                    </span>
                    <span>({booking.totalDays} يوم)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-bold text-primary">{booking.totalPrice} د.إ</p>
                  <p className="text-sm text-muted-foreground">{booking.pricePerDay} د.إ / يوم</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openDetails(booking)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  {booking.status === 'pending' && (
                    <>
                      <Button
                        size="icon"
                        className="bg-emerald-500 hover:bg-emerald-600"
                        onClick={() => handleStatusChange(booking, 'confirmed')}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
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
                      onClick={() => handleStatusChange(booking, 'completed')}
                    >
                      إكمال
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تفاصيل الحجز</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono bg-muted px-3 py-1 rounded">
                  {selectedBooking.bookingNumber}
                </span>
                <Badge className={statusColors[selectedBooking.status]}>
                  {statusLabels[selectedBooking.status]}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">السيارة</span>
                  <span className="font-medium">{selectedBooking.carName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">العميل</span>
                  <span className="font-medium">{selectedBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الهاتف</span>
                  <a href={`tel:${selectedBooking.customerPhone}`} className="font-medium text-primary">
                    {selectedBooking.customerPhone}
                  </a>
                </div>
                {selectedBooking.customerEmail && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">البريد</span>
                    <span className="font-medium">{selectedBooking.customerEmail}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">الاستلام</span>
                    <span className="font-medium">
                      {format(new Date(selectedBooking.pickupDate), 'dd/MM/yyyy', { locale: ar })} - {selectedBooking.pickupTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">التسليم</span>
                    <span className="font-medium">
                      {format(new Date(selectedBooking.dropoffDate), 'dd/MM/yyyy', { locale: ar })} - {selectedBooking.dropoffTime}
                    </span>
                  </div>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">عدد الأيام</span>
                    <span className="font-medium">{selectedBooking.totalDays}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">سعر اليوم</span>
                    <span className="font-medium">{selectedBooking.pricePerDay} د.إ</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">الإجمالي</span>
                    <span className="font-bold text-primary">{selectedBooking.totalPrice} د.إ</span>
                  </div>
                </div>
                {selectedBooking.notes && (
                  <div className="border-t border-border pt-3">
                    <span className="text-muted-foreground block mb-1">ملاحظات</span>
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    const message = `مرحباً ${selectedBooking.customerName}، بخصوص حجزك رقم ${selectedBooking.bookingNumber}`;
                    window.open(`https://wa.me/${selectedBooking.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                >
                  تواصل واتساب
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>إغلاق</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
