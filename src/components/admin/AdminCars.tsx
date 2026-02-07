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
  DialogTrigger,
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
    } catch (error) {
      toast.error('فشل تحديث الحالة');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold">إدارة السيارات</h2>
        <Button onClick={() => handleOpenDialog()} className="btn-gold w-full sm:w-auto">
          <Plus className="w-4 h-4 ml-2" />
          إضافة سيارة
        </Button>
      </div>

      {/* Cars List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : cars.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 sm:p-12 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <CarIcon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold mb-2">لا توجد سيارات</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">أضف أول سيارة لبدء عرضها على الموقع</p>
          <Button onClick={() => handleOpenDialog()} className="btn-gold w-full sm:w-auto">
            <Plus className="w-4 h-4 ml-2" />
            إضافة سيارة
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-card rounded-xl border border-border p-3 sm:p-4"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Image */}
                <div className="w-16 h-12 sm:w-24 sm:h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {car.images && car.images.length > 0 ? (
                    <img
                      src={car.images[0]}
                      alt={car.nameAr}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <CarIcon className="w-4 h-4 sm:w-8 sm:h-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{car.nameAr}</h3>
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{car.name}</p>
                    {car.order !== undefined && (
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        ترتيب: {car.order}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-primary font-medium">{car.priceDaily} د.إ / يوم</p>
                </div>

                {/* Mobile Actions */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3">
                  {/* Availability - Mobile: smaller */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {car.available ? 'متاحة' : 'مشغولة'}
                    </span>
                    <Switch
                      checked={car.available}
                      onCheckedChange={() => handleAvailabilityToggle(car)}
                      className="scale-75 sm:scale-100"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(car)}
                      className="h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCarToDelete(car);
                        setIsDeleteDialogOpen(true);
                      }}
                      className="h-8 w-8 sm:h-10 sm:w-10"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Car Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCar ? 'تعديل السيارة' : 'إضافة سيارة جديدة'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images */}
            <div className="space-y-3">
              <Label>صور السيارة</Label>
              <div className="flex flex-wrap gap-3">
                {formData.images.map((url, index) => (
                  <div
                    key={index}
                    className="relative w-24 h-24 rounded-lg overflow-hidden group"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
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
                />
                <Button type="button" variant="outline" onClick={addImageUrl}>
                  إضافة
                </Button>
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم السيارة (عربي)</Label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  placeholder="مثال: مرسيدس S500"
                />
              </div>
              <div className="space-y-2">
                <Label>اسم السيارة (إنجليزي)</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mercedes S500"
                />
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label>السعر اليومي (د.إ)</Label>
              <Input
                type="number"
                value={formData.priceDaily}
                onChange={(e) => setFormData({ ...formData, priceDaily: +e.target.value })}
              />
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>ناقل الحركة</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value: 'automatic' | 'manual') =>
                    setFormData({ ...formData, transmission: value })
                  }
                >
                  <SelectTrigger>
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
                  <SelectTrigger>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>عدد الركاب</Label>
                <Input
                  type="number"
                  value={formData.passengers}
                  onChange={(e) => setFormData({ ...formData, passengers: +e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>سنة الصنع</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: +e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>ترتيب الظهور (رقم أصغر يظهر أولاً)</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: +e.target.value })}
                  placeholder="مثلاً 1 للظهور في الأول"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>الوصف (عربي)</Label>
              <Textarea
                value={formData.descriptionAr}
                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                placeholder="وصف مختصر للسيارة..."
              />
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label>السيارة متاحة للحجز</Label>
            </div>

            {/* Submit */}
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" className="btn-gold" disabled={isSubmitting}>
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

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف السيارة "{carToDelete?.nameAr}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};
