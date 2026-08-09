import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  FileText,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BlogPost } from '@/types';
import {
  getBlogPosts,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '@/services/firebaseService';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { getBlogPath, slugify } from '@/utils/seoHelpers';
import { toast } from 'sonner';

type BlogForm = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & {
  publishedAt?: Date;
};

const initialForm: BlogForm = {
  slug: '',
  title: '',
  titleAr: '',
  excerpt: '',
  excerptAr: '',
  content: '',
  contentAr: '',
  coverImage: '',
  metaTitle: '',
  metaTitleAr: '',
  metaDescription: '',
  metaDescriptionAr: '',
  keywords: '',
  keywordsAr: '',
  published: true,
};

const SEO_SEED_POSTS: BlogForm[] = [
  {
    slug: 'car-rental-dubai-airport',
    title: 'Car Rental at Dubai Airport — Complete Guide',
    titleAr: 'تأجير سيارات من مطار دبي — دليل كامل',
    excerpt:
      'How to rent a car at Dubai Airport (DXB) with easy pickup, documents you need, and tips for a smooth arrival.',
    excerptAr:
      'كيف تستأجر سيارة من مطار دبي بسهولة: الاستلام، المستندات المطلوبة، ونصائح لوصول مريح بدون تأخير.',
    content:
      'Landing at Dubai Airport and needing a car right away is common for visitors and residents.\n\nAL GENERAL CAR RENTAL offers airport delivery and pickup so you can start your trip without waiting in long counters.\n\nWhat you usually need: a valid driving license, passport or Emirates ID, and a payment/deposit card.\n\nBook ahead via WhatsApp for daily, weekly, or monthly rental — and tell us your flight details for smoother timing.\n\nExplore our fleet and reserve the car that fits your Dubai plans.',
    contentAr:
      'الوصول إلى مطار دبي والحاجة لسيارة فورًا أمر شائع للسياح والمقيمين.\n\nتوفر الچينرال لتأجير السيارات خدمة توصيل واستلام من المطار لتبدأ رحلتك بدون انتظار طويل.\n\nالمستندات المعتادة: رخصة قيادة سارية، جواز سفر أو هوية إماراتية، وبطاقة للدفع/الضمان.\n\nاحجز مسبقًا عبر واتساب للإيجار اليومي أو الأسبوعي أو الشهري، وأخبرنا بتفاصيل رحلتك لتنسيق أفضل.\n\nتصفح أسطولنا واختر السيارة المناسبة لخطتك في دبي.',
    coverImage: '',
    metaTitle: 'Car Rental Dubai Airport | AL GENERAL Guide',
    metaTitleAr: 'تأجير سيارات مطار دبي | دليل الچينرال',
    metaDescription:
      'Rent a car at Dubai Airport with AL GENERAL — pickup tips, documents, and flexible daily to monthly hire.',
    metaDescriptionAr:
      'استأجر سيارة من مطار دبي مع الچينرال — نصائح الاستلام والمستندات وتأجير يومي حتى شهري.',
    keywords: 'dubai airport car rental, rent a car DXB, car hire dubai airport',
    keywordsAr: 'تأجير سيارات مطار دبي, سيارات للإيجار مطار دبي, توصيل سيارة مطار دبي',
    published: true,
  },
  {
    slug: 'dubai-car-rental-prices',
    title: 'Dubai Car Rental Prices — What Affects the Cost',
    titleAr: 'أسعار تأجير السيارات في دبي — ما الذي يؤثر على التكلفة؟',
    excerpt:
      'Understand what drives car rental prices in Dubai and how to choose the best value for your trip.',
    excerptAr:
      'تعرف على العوامل التي تحدد أسعار تأجير السيارات في دبي وكيف تختار أفضل قيمة لرحلتك.',
    content:
      'Car rental prices in Dubai vary by car type, season, and rental length.\n\nEconomy cars cost less for daily city trips, while luxury and sports models suit special occasions.\n\nWeekly and monthly rentals usually offer better value than day-by-day booking.\n\nInsurance coverage, delivery location, and high-demand periods (holidays and events) also affect the quote.\n\nMessage AL GENERAL on WhatsApp with your dates and preferred car class for a clear offer.',
    contentAr:
      'تختلف أسعار تأجير السيارات في دبي حسب نوع السيارة والموسم ومدة الإيجار.\n\nالسيارات الاقتصادية مناسبة للتنقل اليومي، بينما تناسب السيارات الفاخرة والرياضية المناسبات الخاصة.\n\nالإيجار الأسبوعي والشهري غالبًا أوفر من الحجز اليومي المتكرر.\n\nالتأمين، مكان التوصيل، ومواسم الذروة (الإجازات والفعاليات) تؤثر أيضًا على العرض.\n\nراسل الچينرال على واتساب بتواريخك وفئة السيارة المطلوبة لتحصل على عرض واضح.',
    coverImage: '',
    metaTitle: 'Dubai Car Rental Prices | AL GENERAL',
    metaTitleAr: 'أسعار تأجير السيارات في دبي | الچينرال',
    metaDescription:
      'Learn what affects Dubai car rental prices and how to get better value on daily, weekly, and monthly hire.',
    metaDescriptionAr:
      'تعرف على عوامل أسعار تأجير السيارات في دبي وكيف تحصل على قيمة أفضل يوميًا وأسبوعيًا وشهريًا.',
    keywords: 'dubai car rental prices, cheap car rental dubai, monthly car rental dubai',
    keywordsAr: 'أسعار تأجير سيارات دبي, تأجير سيارات رخيص دبي, تأجير شهري دبي',
    published: true,
  },
  {
    slug: 'best-areas-to-drive-in-dubai',
    title: 'Best Areas to Drive in Dubai with a Rental Car',
    titleAr: 'أفضل مناطق القيادة في دبي بسيارة إيجار',
    excerpt:
      'From Dubai Marina to Downtown and Jebel Ali — where a rental car makes exploring Dubai easier.',
    excerptAr:
      'من دبي مارينا إلى داون تاون وجبل علي — أين تسهل سيارة الإيجار استكشاف دبي.',
    content:
      'Dubai is built for driving. A rental car gives you flexibility across Marina, Downtown, Business Bay, and beyond.\n\nDubai Marina and JBR are popular for waterfront evenings. Downtown is ideal for Burj Khalifa and Dubai Mall visits.\n\nBusiness Bay and DIFC suit business travelers. For airport routes and industrial areas, Jebel Ali access is practical.\n\nPlan parking ahead in busy malls and choose a car size that fits your group and luggage.\n\nBrowse the AL GENERAL fleet and book the right car for your itinerary.',
    contentAr:
      'دبي مدينة مناسبة للقيادة، وسيارة الإيجار تمنحك مرونة بين مارينا وداون تاون والخليج التجاري وغيرها.\n\nدبي مارينا وجميرا بيتش ريزيدنس مثالية للأمسيات على الواجهة البحرية. داون تاون مناسب لبرج خليفة ودبي مول.\n\nالخليج التجاري وDIFC يناسبان رجال الأعمال. وللمطار والمناطق الصناعية، الوصول لجبل علي عملي.\n\nخطط للمواقف في المولات المزدحمة واختر حجم سيارة يناسب عدد الركاب والأمتعة.\n\nتصفح أسطول الچينرال واحجز السيارة المناسبة لجدولك.',
    coverImage: '',
    metaTitle: 'Best Areas to Drive in Dubai | Car Rental Tips',
    metaTitleAr: 'أفضل مناطق القيادة في دبي | نصائح تأجير سيارات',
    metaDescription:
      'Discover the best Dubai areas to explore with a rental car — Marina, Downtown, Business Bay, and more.',
    metaDescriptionAr:
      'اكتشف أفضل مناطق دبي للتنقل بسيارة إيجار — مارينا، داون تاون، الخليج التجاري والمزيد.',
    keywords: 'drive in dubai, dubai marina car rental, downtown dubai car hire',
    keywordsAr: 'القيادة في دبي, تأجير سيارات دبي مارينا, تأجير سيارات داون تاون دبي',
    published: true,
  },
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-medium tracking-[0.16em] uppercase text-primary pt-2">{children}</p>
);

export const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<BlogPost | null>(null);
  const [toDelete, setToDelete] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setPosts(await getBlogPosts());
    } catch {
      toast.error('تعذر تحميل المقالات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openDialog = (post?: BlogPost) => {
    if (post) {
      setSelected(post);
      setFormData({
        slug: post.slug,
        title: post.title,
        titleAr: post.titleAr,
        excerpt: post.excerpt || '',
        excerptAr: post.excerptAr || '',
        content: post.content || '',
        contentAr: post.contentAr || '',
        coverImage: post.coverImage || '',
        metaTitle: post.metaTitle || '',
        metaTitleAr: post.metaTitleAr || '',
        metaDescription: post.metaDescription || '',
        metaDescriptionAr: post.metaDescriptionAr || '',
        keywords: post.keywords || '',
        keywordsAr: post.keywordsAr || '',
        published: post.published,
        publishedAt: post.publishedAt,
      });
    } else {
      setSelected(null);
      setFormData(initialForm);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleAr.trim() || !formData.title.trim()) {
      toast.error('أدخل العنوان بالعربي والإنجليزي');
      return;
    }

    const slug = (formData.slug || slugify(formData.title) || slugify(formData.titleAr)).trim();
    if (!slug) {
      toast.error('أدخل رابط SEO (slug) صالح');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData, slug };
      if (selected) {
        await updateBlogPost(selected.id, payload);
        toast.success('تم تحديث المقال');
      } else {
        await addBlogPost({
          ...payload,
          publishedAt: payload.published ? new Date() : undefined,
        });
        toast.success('تم إضافة المقال');
      }
      setIsDialogOpen(false);
      await load();
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteBlogPost(toDelete.id);
      toast.success('تم حذف المقال');
      setIsDeleteOpen(false);
      setToDelete(null);
      await load();
    } catch {
      toast.error('تعذر الحذف');
    }
  };

  const seedSeoPosts = async () => {
    setSeeding(true);
    try {
      for (const post of SEO_SEED_POSTS) {
        const exists = posts.some((p) => p.slug === post.slug);
        if (!exists) {
          await addBlogPost({ ...post, publishedAt: new Date() });
        }
      }
      toast.success('تمت إضافة مقالات SEO الجاهزة');
      await load();
    } catch {
      toast.error('تعذر إضافة المقالات — تأكد من صلاحيات Firestore');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">المدونة / SEO</h2>
          <p className="text-sm text-muted-foreground mt-1">
            مقالات تدعم الأرشفة على جوجل — استخدم slug واضح وكلمات مفتاحية
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {posts.length === 0 && (
            <Button
              variant="outline"
              className="rounded-sm"
              onClick={seedSeoPosts}
              disabled={seeding}
            >
              {seeding ? (
                <Loader2 className="w-4 h-4 ms-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 ms-2" />
              )}
              مقالات SEO جاهزة
            </Button>
          )}
          <Button className="btn-gold rounded-sm" onClick={() => openDialog()}>
            <Plus className="w-4 h-4 ms-2" />
            مقال جديد
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="border border-border/60 bg-card p-8 text-center rounded-sm">
          <FileText className="w-10 h-10 text-primary/60 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">لا توجد مقالات بعد</p>
          <Button className="btn-gold rounded-sm" onClick={seedSeoPosts} disabled={seeding}>
            إضافة 3 مقالات SEO عن تأجير السيارات في دبي
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.2) }}
              className="border border-border/60 bg-card p-4 sm:p-5 rounded-sm flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-bold truncate">{post.titleAr || post.title}</h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-sm border ${
                      post.published
                        ? 'border-primary/30 bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {post.published ? 'منشور' : 'مسودة'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate" dir="ltr">
                  /blog/{post.slug}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {post.published && (
                  <Button asChild variant="ghost" size="sm" className="rounded-sm h-9">
                    <Link to={getBlogPath(post)} target="_blank">
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-sm h-9"
                  onClick={() => openDialog(post)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-sm h-9 text-destructive"
                  onClick={() => {
                    setToDelete(post);
                    setIsDeleteOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected ? 'تعديل مقال' : 'مقال جديد'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between gap-3 border border-border/60 p-3 rounded-sm">
              <div>
                <Label>منشور على الموقع</Label>
                <p className="text-xs text-muted-foreground">المسودات لا تظهر في جوجل/السايت ماب</p>
              </div>
              <Switch
                checked={formData.published}
                onCheckedChange={(v) => setFormData((f) => ({ ...f, published: v }))}
              />
            </div>

            <SectionTitle>المحتوى</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>العنوان (عربي)</Label>
                <Input
                  value={formData.titleAr}
                  onChange={(e) => setFormData((f) => ({ ...f, titleAr: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>Title (English)</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData((f) => ({
                      ...f,
                      title,
                      slug: f.slug || slugify(title),
                    }));
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Slug (رابط SEO)</Label>
              <Input
                dir="ltr"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, slug: slugify(e.target.value) || e.target.value }))
                }
                placeholder="car-rental-dubai-airport"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>مقتطف عربي</Label>
                <Textarea
                  rows={3}
                  value={formData.excerptAr}
                  onChange={(e) => setFormData((f) => ({ ...f, excerptAr: e.target.value }))}
                />
              </div>
              <div>
                <Label>Excerpt (EN)</Label>
                <Textarea
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData((f) => ({ ...f, excerpt: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>المحتوى عربي</Label>
                <Textarea
                  rows={8}
                  value={formData.contentAr}
                  onChange={(e) => setFormData((f) => ({ ...f, contentAr: e.target.value }))}
                  placeholder="افصل الفقرات بسطر فارغ"
                />
              </div>
              <div>
                <Label>Content (EN)</Label>
                <Textarea
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Separate paragraphs with a blank line"
                />
              </div>
            </div>

            <ImageUploader
              value={formData.coverImage}
              label="صورة الغلاف — رفع من الجهاز"
              hint="الصورة تتضغط وتتحفظ مع المقال في Firestore (بدون Storage)"
              onChange={(next) =>
                setFormData((f) => ({
                  ...f,
                  coverImage: Array.isArray(next) ? next[0] || '' : next || '',
                }))
              }
            />

            <SectionTitle>SEO</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Meta Title AR</Label>
                <Input
                  value={formData.metaTitleAr}
                  onChange={(e) => setFormData((f) => ({ ...f, metaTitleAr: e.target.value }))}
                />
              </div>
              <div>
                <Label>Meta Title EN</Label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) => setFormData((f) => ({ ...f, metaTitle: e.target.value }))}
                />
              </div>
              <div>
                <Label>Meta Description AR</Label>
                <Textarea
                  rows={2}
                  value={formData.metaDescriptionAr}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, metaDescriptionAr: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Meta Description EN</Label>
                <Textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData((f) => ({ ...f, metaDescription: e.target.value }))}
                />
              </div>
              <div>
                <Label>Keywords AR</Label>
                <Input
                  value={formData.keywordsAr}
                  onChange={(e) => setFormData((f) => ({ ...f, keywordsAr: e.target.value }))}
                />
              </div>
              <div>
                <Label>Keywords EN</Label>
                <Input
                  value={formData.keywords}
                  onChange={(e) => setFormData((f) => ({ ...f, keywords: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
              <Button type="submit" className="btn-gold" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'حفظ'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المقال؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف "{toDelete?.titleAr || toDelete?.title}" نهائيًا.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
