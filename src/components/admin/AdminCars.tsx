import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Car as CarIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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
import { Car } from '@/types';
import { addCar, updateCar, deleteCar } from '@/services/firebaseService';
import { toast } from 'sonner';

interface AdminCarsProps {
  cars: Car[];
  onRefresh: () => void;
  loading: boolean;
}

const initialCarState: Omit<Car, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  nameAr: '',
  images: [],
  priceDaily: 0,
  priceWeekly: 0,
  priceMonthly: 0,
  transmission: 'automatic',
  passengers: 5,
  fuelType: 'petrol',
  description: '',
  descriptionAr: '',
  available: true,
  category: '',
  year: new Date().getFullYear(),
  order: 999,
};

export const AdminCars = ({ cars, onRefresh, loading }: AdminCarsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const [formData, setFormData] = useState<Omit<Car, 'id' | 'createdAt' | 'updatedAt'>>(initialCarState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleOpenDialog = (car?: Car) => {
    if (car) {
      setSelectedCar(car);
      setFormData({
        name: car.name,
        nameAr: car.nameAr,
        images: car.images || [],
        priceDaily: car.priceDaily,
        priceWeekly: car.priceWeekly,
        priceMonthly: car.priceMonthly,
        transmission: car.transmission,
        passengers: car.passengers,
        fuelType: car.fuelType,
        description: car.description || '',
        descriptionAr: car.descriptionAr || '',
        available: car.available,
        category: car.category || '',
        year: car.year,
        order: car.order ?? 999,
      });
    } else {
      setSelectedCar(null);
      setFormData(initialCarState);
    }
    setIsDialogOpen(true);
  };

  const addImageUrl = () => {
    const trimmed = imageUrl.trim();
    if (!trimmed) {
      toast.error('يرجى إدخال رابط صورة صالح');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, trimmed],
    }));
    setImageUrl('');
    toast.success('تم إضافة رابط الصورة');
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nameAr || !formData.name) {
      toast.error('يرجى إدخال اسم السيارة');
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedCar) {
        await updateCar(selectedCar.id, formData);
        toast.success('تم تحديث السيارة بنجاح');
      } else {
        await addCar(formData);
        toast.success('تم إضافة السيارة بنجاح');
      }
      setIsDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('حدث خطأ. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!carToDelete) return;

    try {
      await deleteCar(carToDelete.id);
      toast.success('تم حذف السيارة بنجاح');
      onRefresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('فشل حذف السيارة');
    } finally {
      setIsDeleteDialogOpen(false);
      setCarToDelete(null);
    }
  };

  const handleAvailabilityToggle = async (car: Car) => {
    try {
      await updateCar(car.id, { available: !car.available });
      toast.success(car.available ? 'تم تعيين السيارة كمشغولة' : 'تم تعيين السيارة كمتاحة');
      onRefresh();
    } catch {
      toast.error('فشل تحديث الحالة');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
        <div>
          <p className="section-eyebrow mb-2">Fleet</p>
          <h2 className="text-xl sm:text-2xl font-bold">إدارة السيارات</h2>
        </div>
        <Button onClick={() => handleOpenDialog()} className="btn-gold rounded-md w-full sm:w-auto">
          <Plus className="w-4 h-4 ml-2" />
          إضافة سيارة
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : cars.length === 0 ? (
        <div className="rounded-md border border-border/60 bg-card p-8 sm:p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-md bg-muted border border-border/50 flex items-center justify-center">
            <CarIcon className="w-7 h-7 text-primary/70" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">لا توجد سيارات</h3>
          <p className="text-sm text-muted-foreground mb-5">أضف أول سيارة لبدء عرضها على الموقع</p>
          <Button onClick={() => handleOpenDialog()} className="btn-gold rounded-md">
            <Plus className="w-4 h-4 ml-2" />
            إضافة سيارة
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {cars.map((car) => (
            <div
              key={car.id}
              className="rounded-md border border-border/60 bg-card p-3 sm:p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-16 h-12 sm:w-24 sm:h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={car.nameAr}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CarIcon className="w-4 h-4 sm:w-7 sm:h-7 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                    {car.nameAr}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate font-display tracking-wide">
                      {car.name}
                    </p>
                    {car.order !== undefined && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                        ترتيب: {car.order}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-primary font-semibold mt-0.5">
                    {car.priceDaily} د.إ / يوم
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {car.available ? 'متاحة' : 'مشغولة'}
                    </span>
                    <Switch
                      checked={car.available}
                      onCheckedChange={() => handleAvailabilityToggle(car)}
                      className="scale-75 sm:scale-100"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(car)}
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-md"
                    >
                      <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCarToDelete(car);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="h-8 w-8 sm:h-9 sm:w-9 rounded-md"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedCar ? 'تعديل السيارة' : 'إضافة سيارة جديدة'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label>صور السيارة</Label>
              <div className="flex flex-wrap gap-3">
                {formData.images.map((url, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-md overflow-hidden group border border-border/50"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="ضع رابط الصورة هنا ثم اضغط إضافة"
                  className="rounded-md"
                />
                <Button type="button" variant="outline" onClick={addImageUrl} className="rounded-md">
                  إضافة
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم السيارة (عربي)</Label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="مثال: مرسيدس S500"
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label>اسم السيارة (إنجليزي)</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mercedes S500"
                  className="rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>السعر اليومي (د.إ)</Label>
              <Input
                type="number"
                value={formData.priceDaily}
                onChange={(e) => setFormData({ ...formData, priceDaily: +e.target.value })}
                className="rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ناقل الحركة</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value: 'automatic' | 'manual') =>
                    setFormData({ ...formData, transmission: value })
                  }
                >
                  <SelectTrigger className="rounded-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automatic">أوتوماتيك</SelectItem>
                    <SelectItem value="manual">عادي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>نوع الوقود</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value: 'petrol' | 'diesel' | 'electric' | 'hybrid') =>
                    setFormData({ ...formData, fuelType: value })
                  }
                >
                  <SelectTrigger className="rounded-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">بنزين</SelectItem>
                    <SelectItem value="diesel">ديزل</SelectItem>
                    <SelectItem value="electric">كهربائي</SelectItem>
                    <SelectItem value="hybrid">هايبرد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>عدد الركاب</Label>
                <Input
                  type="number"
                  value={formData.passengers}
                  onChange={(e) => setFormData({ ...formData, passengers: +e.target.value })}
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label>سنة الصنع</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: +e.target.value })}
                  className="rounded-md"
                />
              </div>
              <div className="space-y-2">
                <Label>ترتيب الظهور</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: +e.target.value })}
                  placeholder="1 للأول"
                  className="rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>الوصف (عربي)</Label>
              <Textarea
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                placeholder="وصف مختصر للسيارة..."
                className="rounded-md"
              />
            </div>

            <div className="flex items-center justify-between rounded-md border border-border/50 px-4 py-3">
              <Label>السيارة متاحة للحجز</Label>
              <Switch
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-md"
              >
                إلغاء
              </Button>
              <Button type="submit" className="btn-gold rounded-md" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف السيارة "{carToDelete?.nameAr}"؟ لا يمكن التراجع عن هذا الإجراء.
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
