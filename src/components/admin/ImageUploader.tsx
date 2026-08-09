import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { fileToCompressedDataUrl } from '@/utils/imageCompress';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ImageUploaderProps = {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  label?: string;
  hint?: string;
  maxFiles?: number;
  className?: string;
};

export const ImageUploader = ({
  value,
  onChange,
  multiple = false,
  label = 'رفع صورة من الجهاز',
  hint = 'يتم ضغط الصورة وحفظها مع البيانات في Firestore (بدون Storage)',
  maxFiles = 6,
  className,
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const urls = Array.isArray(value) ? value : value ? [value] : [];

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!list.length) {
      toast.error('اختر ملف صورة فقط (JPG / PNG / WEBP)');
      return;
    }

    if (!multiple && list.length > 1) {
      toast.error('اختر صورة واحدة فقط');
      return;
    }

    if (multiple && urls.length + list.length > maxFiles) {
      toast.error(`الحد الأقصى ${maxFiles} صور`);
      return;
    }

    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of list) {
        const dataUrl = await fileToCompressedDataUrl(file);
        uploaded.push(dataUrl);
      }

      if (multiple) onChange([...urls, ...uploaded]);
      else onChange(uploaded[0]);

      toast.success(uploaded.length > 1 ? `تم تجهيز ${uploaded.length} صور` : 'تم تجهيز الصورة');
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : 'فشل تجهيز الصورة');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const removeAt = (index: number) => {
    const next = urls.filter((_, i) => i !== index);
    onChange(multiple ? next : '');
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label ? <Label>{label}</Label> : null}

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {urls.map((url, index) => (
            <div
              key={`${index}-${url.slice(0, 32)}`}
              className="relative w-28 h-28 sm:w-32 sm:h-32 overflow-hidden border border-border/60 bg-muted group"
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute inset-0 bg-ink/55 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                aria-label="حذف"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={cn(
          'relative border border-dashed border-border/80 bg-muted/40 px-4 py-6 text-center transition-colors',
          uploading ? 'opacity-70' : 'hover:border-primary/40 hover:bg-primary/5'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple={multiple}
          disabled={uploading}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="pointer-events-none flex flex-col items-center gap-2">
          {uploading ? (
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center border border-primary/30 bg-primary/10">
              {multiple ? (
                <ImagePlus className="w-5 h-5 text-primary" />
              ) : (
                <Upload className="w-5 h-5 text-primary" />
              )}
            </span>
          )}
          <p className="text-sm font-medium text-foreground">
            {uploading ? 'جاري ضغط الصورة…' : 'اضغط لاختيار صورة من جهازك'}
          </p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 ms-2 animate-spin" />
        ) : (
          <Upload className="w-4 h-4 ms-2" />
        )}
        اختيار من الجهاز
      </Button>
    </div>
  );
};
