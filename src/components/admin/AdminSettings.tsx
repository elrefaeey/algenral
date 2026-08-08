import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SiteSettings, defaultSiteSettings } from '@/types';
import { getSiteSettings, updateSiteSettings } from '@/services/firebaseService';
import { toast } from 'sonner';

export const AdminSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getSiteSettings();
        setSettings({ ...defaultSiteSettings, ...data });
      } catch (error) {
        console.error('Error loading site settings:', error);
        setSettings(defaultSiteSettings);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!settings.companyName || !settings.phone) {
      toast.error('اسم الشركة ورقم الهاتف مطلوبان');
      return;
    }

    setIsSaving(true);
    try {
      await updateSiteSettings(settings);
      toast.success('تم حفظ إعدادات الشركة');
    } catch (error) {
      console.error('Save settings error:', error);
      toast.error('فشل حفظ الإعدادات');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <p className="section-eyebrow mb-2">Company</p>
        <h2 className="text-xl sm:text-2xl font-bold">إعدادات الشركة</h2>
        <p className="text-sm text-muted-foreground mt-1">
          بيانات NAP تظهر في Schema والفوتر وصفحات التواصل (بعد ربطها لاحقاً من Firebase)
        </p>
      </div>

      <div className="rounded-md border border-border/60 bg-card p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>اسم الشركة (إنجليزي)</Label>
            <Input
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="rounded-md"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>اسم الشركة (عربي)</Label>
            <Input
              value={settings.companyNameAr}
              onChange={(e) => setSettings({ ...settings, companyNameAr: e.target.value })}
              className="rounded-md"
            />
          </div>
          <div className="space-y-2">
            <Label>الهاتف</Label>
            <Input
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="rounded-md"
              dir="ltr"
              placeholder="00971555900747"
            />
          </div>
          <div className="space-y-2">
            <Label>واتساب</Label>
            <Input
              value={settings.whatsapp}
              onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
              className="rounded-md"
              dir="ltr"
              placeholder="+971555900747"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>البريد الإلكتروني</Label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="rounded-md"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>العنوان (إنجليزي)</Label>
            <Textarea
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="rounded-md"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>العنوان (عربي)</Label>
            <Textarea
              value={settings.addressAr}
              onChange={(e) => setSettings({ ...settings, addressAr: e.target.value })}
              className="rounded-md"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>رقم الرخصة التجارية</Label>
            <Input
              value={settings.licenseNumber}
              onChange={(e) => setSettings({ ...settings, licenseNumber: e.target.value })}
              className="rounded-md"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="btn-gold rounded-md" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            'حفظ إعدادات الشركة'
          )}
        </Button>
      </div>
    </motion.div>
  );
};
