import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Loader2, Trash2, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HomeContent, defaultHomeContent } from '@/types';
import { getHomeContent, updateHomeContent } from '@/services/firebaseService';
import { toast } from 'sonner';

export const AdminHome = () => {
  const [content, setContent] = useState<HomeContent>(defaultHomeContent);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [backgroundUrlInput, setBackgroundUrlInput] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getHomeContent();
        setContent(data);
        setBackgroundUrlInput(data.backgroundUrl);
      } catch (error) {
        console.error('Error fetching home content:', error);
        // Use default content if there's an error
        setContent(defaultHomeContent);
        setBackgroundUrlInput('');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleBackgroundUrlChange = () => {
    if (backgroundUrlInput.trim()) {
      // Detect if it's a video URL
      const isVideo = backgroundUrlInput.includes('.mp4') || 
                     backgroundUrlInput.includes('.webm') || 
                     backgroundUrlInput.includes('.ogg') ||
                     backgroundUrlInput.includes('youtube.com') ||
                     backgroundUrlInput.includes('vimeo.com');
      
      setContent((prev) => ({
        ...prev,
        backgroundUrl: backgroundUrlInput.trim(),
        backgroundType: isVideo ? 'video' : 'image',
      }));
      
      toast.success('تم تحديث رابط الخلفية');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateHomeContent(content);
      toast.success('تم حفظ التغييرات بنجاح');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('فشل حفظ التغييرات');
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
      <h2 className="text-2xl font-bold">إعدادات الصفحة الرئيسية</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Background Settings */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">الخلفية</h3>

          {/* Current Background */}
          {content.backgroundUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              {content.backgroundType === 'video' ? (
                <video
                  src={content.backgroundUrl}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                />
              ) : (
                <img
                  src={content.backgroundUrl}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
              )}
              <button
                onClick={() => setContent({ ...content, backgroundUrl: '' })}
                className="absolute top-2 left-2 p-2 bg-destructive rounded-lg text-white hover:bg-destructive/90"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Background URL Input */}
          <div className="space-y-2">
            <Label>رابط الخلفية</Label>
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={backgroundUrlInput}
                onChange={(e) => setBackgroundUrlInput(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleBackgroundUrlChange}
                variant="outline"
                size="sm"
                className="px-3"
              >
                <Link className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>نوع الخلفية</Label>
            <Select
              value={content.backgroundType}
              onValueChange={(value: 'image' | 'video') =>
                setContent({ ...content, backgroundType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    صورة
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    فيديو
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Text Settings */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-4">
          <h3 className="text-lg font-semibold">النصوص</h3>

          <div className="space-y-2">
            <Label>العنوان الرئيسي</Label>
            <Input
              value={content.mainTitle}
              onChange={(e) => setContent({ ...content, mainTitle: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>العنوان الفرعي</Label>
            <Input
              value={content.subtitle}
              onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>نص زر الحجز</Label>
            <Input
              value={content.ctaButtonText}
              onChange={(e) => setContent({ ...content, ctaButtonText: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>نص زر واتساب</Label>
            <Input
              value={content.whatsappButtonText}
              onChange={(e) => setContent({ ...content, whatsappButtonText: e.target.value })}
            />
          </div>
        </div>

        {/* Visibility Settings */}
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-4 lg:col-span-2">
          <h3 className="text-lg font-semibold">إظهار/إخفاء العناصر</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label>إظهار زر الحجز</Label>
              <Switch
                checked={content.showCta}
                onCheckedChange={(checked) => setContent({ ...content, showCta: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>إظهار زر واتساب</Label>
              <Switch
                checked={content.showWhatsapp}
                onCheckedChange={(checked) => setContent({ ...content, showWhatsapp: checked })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="btn-gold" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            'حفظ التغييرات'
          )}
        </Button>
      </div>
    </motion.div>
  );
};
