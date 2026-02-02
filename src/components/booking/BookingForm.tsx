import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, differenceInDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar, Clock, User, Phone, Mail, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, Booking } from '@/types';
import { addBooking, checkDateAvailability } from '@/services/firebaseService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const bookingSchema = z.object({
  customerName: z.string().min(2, 'الاسم مطلوب'),
  customerPhone: z.string().min(9, 'رقم الهاتف غير صحيح'),
  customerEmail: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  pickupTime: z.string().min(1, 'وقت الاستلام مطلوب'),
  dropoffTime: z.string().min(1, 'وقت التسليم مطلوب'),
  notes: z.string().optional().or(z.literal('')),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  car: Car;
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

export const BookingForm = ({ car }: BookingFormProps) => {
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const [pricePerDay, setPricePerDay] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  // Calculate pricing
  useEffect(() => {
    if (pickupDate && dropoffDate) {
      const days = differenceInDays(dropoffDate, pickupDate) + 1;
      setTotalDays(days);
      setPricePerDay(car.priceDaily);
      setTotalPrice(car.priceDaily * days);
    } else {
      setTotalDays(0);
      setPricePerDay(0);
      setTotalPrice(0);
    }
  }, [pickupDate, dropoffDate, car]);

  // Check availability when dates change
  useEffect(() => {
    const checkAvailability = async () => {
      if (pickupDate && dropoffDate) {
        setDateError(null);
        const isAvailable = await checkDateAvailability(car.id, pickupDate, dropoffDate);
        if (!isAvailable) {
          setDateError('هذه السيارة غير متاحة في التاريخ المختار');
        }
      }
    };
    checkAvailability();
  }, [pickupDate, dropoffDate, car.id]);

  const onSubmit = async (data: BookingFormData) => {
    if (!pickupDate || !dropoffDate) {
      toast.error('يرجى تحديد تاريخ الاستلام والتسليم');
      return;
    }

    if (dateError) {
      toast.error(dateError);
      return;
    }

    setIsSubmitting(true);

    try {
      const booking = await addBooking({
        carId: car.id,
        carName: car.nameAr,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || '',
        pickupDate,
        pickupTime: data.pickupTime,
        dropoffDate,
        dropoffTime: data.dropoffTime,
        totalDays,
        pricePerDay,
        totalPrice,
        notes: data.notes || '',
        status: 'pending',
      });

      // Create WhatsApp message
      const message = `🚗 حجز جديد - ${booking.bookingNumber}

السيارة: ${car.nameAr}
📅 الاستلام: ${format(pickupDate, 'dd/MM/yyyy', { locale: ar })} - ${data.pickupTime}
📅 التسليم: ${format(dropoffDate, 'dd/MM/yyyy', { locale: ar })} - ${data.dropoffTime}
📊 عدد الأيام: ${totalDays}
💰 السعر الإجمالي: ${totalPrice} د.إ

👤 الاسم: ${data.customerName}
📱 الهاتف: ${data.customerPhone}
${data.customerEmail ? `📧 البريد: ${data.customerEmail}` : ''}
${data.notes ? `📝 ملاحظات: ${data.notes}` : ''}`;

      const whatsappUrl = `https://wa.me/971555900747?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      toast.success('تم إرسال طلب الحجز بنجاح!');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {dateError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{dateError}</AlertDescription>
        </Alert>
      )}

      {/* Date Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>تاريخ الاستلام</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-right',
                  !pickupDate && 'text-muted-foreground'
                )}
              >
                <Calendar className="ml-2 h-4 w-4" />
                {pickupDate ? format(pickupDate, 'dd/MM/yyyy', { locale: ar }) : 'اختر التاريخ'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={pickupDate}
                onSelect={setPickupDate}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>وقت الاستلام</Label>
          <Select onValueChange={(value) => setValue('pickupTime', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الوقت" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.pickupTime && (
            <p className="text-sm text-destructive">{errors.pickupTime.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>تاريخ التسليم</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-right',
                  !dropoffDate && 'text-muted-foreground'
                )}
              >
                <Calendar className="ml-2 h-4 w-4" />
                {dropoffDate ? format(dropoffDate, 'dd/MM/yyyy', { locale: ar }) : 'اختر التاريخ'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dropoffDate}
                onSelect={setDropoffDate}
                disabled={(date) => date < (pickupDate || new Date())}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>وقت التسليم</Label>
          <Select onValueChange={(value) => setValue('dropoffTime', value)}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الوقت" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.dropoffTime && (
            <p className="text-sm text-destructive">{errors.dropoffTime.message}</p>
          )}
        </div>
      </div>

      {/* Price Summary */}
      {totalDays > 0 && (
        <div className="bg-muted rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>عدد الأيام</span>
            <span className="font-medium">{totalDays} يوم</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>سعر اليوم</span>
            <span className="font-medium">{pricePerDay} د.إ</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-bold">الإجمالي</span>
            <span className="font-bold text-primary text-lg">{totalPrice} د.إ</span>
          </div>
        </div>
      )}

      {/* Customer Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">الاسم الكامل</Label>
          <div className="relative">
            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="customerName"
              placeholder="أدخل اسمك"
              className="pr-10"
              {...register('customerName')}
            />
          </div>
          {errors.customerName && (
            <p className="text-sm text-destructive">{errors.customerName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerPhone">رقم الهاتف / واتساب</Label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="customerPhone"
              placeholder="+971 55 XXX XXXX"
              className="pr-10"
              {...register('customerPhone')}
            />
          </div>
          {errors.customerPhone && (
            <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerEmail">البريد الإلكتروني (اختياري)</Label>
          <div className="relative">
            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="customerEmail"
              type="email"
              placeholder="email@example.com"
              className="pr-10"
              {...register('customerEmail')}
            />
          </div>
          {errors.customerEmail && (
            <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">ملاحظات (اختياري)</Label>
          <div className="relative">
            <FileText className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
            <Textarea
              id="notes"
              placeholder="أي ملاحظات إضافية..."
              className="pr-10 min-h-[80px]"
              {...register('notes')}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full btn-gold py-6 text-lg"
        disabled={isSubmitting || !pickupDate || !dropoffDate || !!dateError || !car.available}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="ml-2 h-5 w-5 animate-spin" />
            جاري الحجز...
          </>
        ) : (
          'تأكيد الحجز'
        )}
      </Button>
    </form>
  );
};
