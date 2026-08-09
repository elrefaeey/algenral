/** Compress an image File to a JPEG data URL safe for Firestore fields. */

type CompressOptions = {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxBytes?: number;
};

const DEFAULTS: Required<CompressOptions> = {
  maxWidth: 1400,
  maxHeight: 1400,
  quality: 0.78,
  maxBytes: 450_000, // keep room under Firestore 1MB doc limit
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('تعذر قراءة الصورة'));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error('فشل ضغط الصورة'));
        else resolve(blob);
      },
      'image/jpeg',
      quality
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('فشل تحويل الصورة'));
    reader.readAsDataURL(blob);
  });
}

export async function fileToCompressedDataUrl(
  file: File,
  options: CompressOptions = {}
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('الملف يجب أن يكون صورة');
  }

  const opts = { ...DEFAULTS, ...options };
  const img = await loadImage(file);

  let { width, height } = img;
  const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height, 1);
  width = Math.round(width * ratio);
  height = Math.round(height * ratio);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('المتصفح لا يدعم ضغط الصور');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  let quality = opts.quality;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > opts.maxBytes && quality > 0.45) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, quality);
  }

  if (blob.size > opts.maxBytes) {
    // Final shrink pass
    canvas.width = Math.round(width * 0.75);
    canvas.height = Math.round(height * 0.75);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    blob = await canvasToBlob(canvas, 0.55);
  }

  if (blob.size > opts.maxBytes) {
    throw new Error('الصورة كبيرة بعد الضغط — جرّب صورة أصغر');
  }

  return blobToDataUrl(blob);
}
