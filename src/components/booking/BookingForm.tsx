import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, differenceInDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar, User, Phone, Mail, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car } from '@/types';
import { addBooking, checkDateAvailability, getSiteSettings } from '@/services/firebaseService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

type BookingFormData = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupTime: string;
  dropoffTime: string;
  notes?: string;
};

interface BookingFormProps {
  car: Car;
}

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00',
];

const fieldClass =
  'rounded-sm h-12 border-border/70 bg-background hover:bg-card focus-visible:ring-primary/30 touch-manipulation';

export const BookingForm = ({ car }: BookingFormProps) => {
  const { t, lang } = useLanguage();
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState('971555900747');

  const bookingSchema = z.object({
    customerName: z.string().min(2, lang === 'ar' ? 'الاسم مطلوب' : 'Name is required'),
    customerPhone: z.string().min(9, lang === 'ar' ? 'رقم الهاتف غير صحيح' : 'Invalid phone number'),
    customerEmail: z
      .string()
      .email(lang === 'ar' ? 'البريد الإلكتروني غير صحيح' : 'Invalid email')
      .optional()
      .or(z.literal('')),
    pickupTime: z.string().min(1, lang === 'ar' ? 'وقت الاستلام مطلوب' : 'Pickup time is required'),
    dropoffTime: z.string().min(1, lang === 'ar' ? 'وقت التسليم مطلوب' : 'Drop-off time is required'),
    notes: z.string().optional().or(z.literal('')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  useEffect(() => {
    getSiteSettings()
      .then((s) => {
        const digits = (s.whatsapp || s.phone || '').replace(/[^\d]/g, '');
        if (digits) setWhatsappNumber(digits.replace(/^00/, ''));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (pickupDate && dropoffDate) {
      setTotalDays(differenceInDays(dropoffDate, pickupDate) + 1);
    } else {
      setTotalDays(0);
    }
  }, [pickupDate, dropoffDate]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (pickupDate && dropoffDate) {
        setDateError(null);
        const isAvailable = await checkDateAvailability(car.id, pickupDate, dropoffDate);
        if (!isAvailable) {
          setDateError(t.booking.unavailableDates);
        }
      }
    };
    checkAvailability();
  }, [pickupDate, dropoffDate, car.id, t.booking.unavailableDates]);

  const onSubmit = async (data: BookingFormData) => {
    if (!pickupDate || !dropoffDate) {
      toast.error(
        lang === 'ar'
          ? 'يرجى تحديد تاريخ الاستلام والتسليم'
          : 'Please select pickup and drop-off dates'
      );
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
        pricePerDay: 0,
        totalPrice: 0,
        notes: data.notes || '',
        status: 'pending',
      });

      const message = `🚗 حجز جديد - ${booking.bookingNumber}

السيارة: ${car.nameAr}
📅 الاستلام: ${format(pickupDate, 'dd/MM/yyyy', { locale: ar })} - ${data.pickupTime}
📅 التسليم: ${format(dropoffDate, 'dd/MM/yyyy', { locale: ar })} - ${data.dropoffTime}
📊 عدد الأيام: ${totalDays}

👤 الاسم: ${data.customerName}
📱 الهاتف: ${data.customerPhone}
${data.customerEmail ? `📧 البريد: ${data.customerEmail}` : ''}
${data.notes ? `📝 ملاحظات: ${data.notes}` : ''}`;

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      toast.success(lang === 'ar' ? 'تم إرسال طلب الحجز بنجاح!' : 'Booking request sent successfully!');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(
        lang === 'ar'
          ? 'حدث خطأ أثناء الحجز. يرجى المحاولة مرة أخرى.'
          : 'Booking failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-7">
      {dateError && (
        <Alert variant="destructive" className="rounded-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{dateError}</AlertDescription>
        </Alert>
      )}

      {/* Step 1 — Schedule */}
      <section className="rounded-sm border border-border/60 bg-muted/20 p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary/15 text-primary text-xs font-bold">
            1
          </span>
          <p className="text-xs font-medium tracking-[0.16em] uppercase text-primary">
            {t.booking.schedule}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-foreground/85">{t.booking.pickupDate}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start',
                    fieldClass,
                    !pickupDate && 'text-muted-foreground'
                  )}
                >
                  <Calendar className="me-2 h-4 w-4 text-primary" />
                  {pickupDate
                    ? format(pickupDate, 'dd/MM/yyyy', { locale: lang === 'ar' ? ar : undefined })
                    : t.booking.chooseDate}
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
            <Label className="text-sm text-foreground/85">{t.booking.pickupTime}</Label>
            <Select onValueChange={(value) => setValue('pickupTime', value)}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder={t.booking.chooseTime} />
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

          <div className="space-y-2">
            <Label className="text-sm text-foreground/85">{t.booking.dropoffDate}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start',
                    fieldClass,
                    !dropoffDate && 'text-muted-foreground'
                  )}
                >
                  <Calendar className="me-2 h-4 w-4 text-primary" />
                  {dropoffDate
                    ? format(dropoffDate, 'dd/MM/yyyy', { locale: lang === 'ar' ? ar : undefined })
                    : t.booking.chooseDate}
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
            <Label className="text-sm text-foreground/85">{t.booking.dropoffTime}</Label>
            <Select onValueChange={(value) => setValue('dropoffTime', value)}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder={t.booking.chooseTime} />
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

        {totalDays > 0 && (
          <div className="flex items-center justify-between rounded-sm bg-background/80 border border-border/50 px-4 py-3 text-sm">
            <span className="tracking-[0.1em] uppercase text-muted-foreground">{t.booking.days}</span>
            <span className="font-display text-xl tracking-wide text-foreground">
              {totalDays} {t.booking.day}
            </span>
          </div>
        )}
      </section>

      {/* Step 2 — Customer */}
      <section className="rounded-sm border border-border/60 bg-muted/20 p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary/15 text-primary text-xs font-bold">
            2
          </span>
          <p className="text-xs font-medium tracking-[0.16em] uppercase text-primary">
            {t.booking.customer}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="customerName" className="text-sm text-foreground/85">
              {t.booking.fullName}
            </Label>
            <div className="relative">
              <User className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="customerName"
                placeholder={t.booking.namePlaceholder}
                className={cn(fieldClass, 'pe-10')}
                {...register('customerName')}
              />
            </div>
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone" className="text-sm text-foreground/85">
              {t.booking.phone}
            </Label>
            <div className="relative">
              <Phone className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="customerPhone"
                placeholder="+971 55 XXX XXXX"
                className={cn(fieldClass, 'pe-10')}
                dir="ltr"
                inputMode="tel"
                {...register('customerPhone')}
              />
            </div>
            {errors.customerPhone && (
              <p className="text-sm text-destructive">{errors.customerPhone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail" className="text-sm text-foreground/85">
              {t.booking.email}
            </Label>
            <div className="relative">
              <Mail className="absolute end-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="customerEmail"
                type="email"
                placeholder="email@example.com"
                className={cn(fieldClass, 'pe-10')}
                dir="ltr"
                {...register('customerEmail')}
              />
            </div>
            {errors.customerEmail && (
              <p className="text-sm text-destructive">{errors.customerEmail.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes" className="text-sm text-foreground/85">
              {t.booking.notes}
            </Label>
            <div className="relative">
              <FileText className="absolute end-3 top-3 w-4 h-4 text-muted-foreground" />
              <Textarea
                id="notes"
                placeholder={t.booking.notesPlaceholder}
                className="pe-10 min-h-[100px] rounded-sm border-border/70 bg-background hover:bg-card focus-visible:ring-primary/30"
                {...register('notes')}
              />
            </div>
          </div>
        </div>
      </section>

      <Button
        type="submit"
        className="w-full btn-gold py-6 text-sm tracking-[0.14em] uppercase rounded-sm touch-manipulation"
        disabled={isSubmitting || !pickupDate || !dropoffDate || !!dateError || !car.available}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="ms-2 h-5 w-5 animate-spin" />
            {t.booking.submitting}
          </>
        ) : (
          t.booking.confirm
        )}
      </Button>
    </form>
  );
};
