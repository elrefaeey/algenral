import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2, ChevronLeft } from 'lucide-react';
import logoSrc from '@/assets/logo-removebg-preview.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useSEO } from '@/hooks/useSEO';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useSEO({
    title: 'Admin Login - AL GENERAL CAR RENTAL',
    description: 'Admin access only',
    noindex: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('تم تسجيل الدخول بنجاح');
      navigate('/admin');
    } catch (error: unknown) {
      const code =
        typeof error === 'object' && error && 'code' in error
          ? String((error as { code?: string }).code)
          : '';
      const errorMessage =
        code === 'auth/invalid-credential'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : 'حدث خطأ. يرجى المحاولة مرة أخرى';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 45% at 85% 15%, hsl(var(--primary) / 0.3), transparent), radial-gradient(ellipse 50% 40% at 10% 90%, hsl(var(--primary) / 0.14), transparent), radial-gradient(ellipse 40% 30% at 50% 50%, hsl(var(--primary) / 0.06), transparent)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <div className="relative overflow-hidden border border-white/10 bg-card/95 backdrop-blur-md shadow-medium">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-l from-transparent via-primary to-transparent" />

          <div className="p-7 sm:p-9">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex justify-center mb-5 group">
                <img
                  src={logoSrc}
                  alt="AL GENERAL CAR RENTAL"
                  className="h-16 sm:h-[4.5rem] w-auto max-w-[260px] object-contain transition-opacity group-hover:opacity-90"
                />
              </Link>
              <p className="text-[11px] font-medium tracking-[0.22em] uppercase text-primary mb-2">
                Admin Access
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">لوحة الإدارة</h1>
              <p className="text-muted-foreground mt-1.5 text-sm">
                الچينرال لتأجير السيارات
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative">
                  <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/80" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@example.com"
                    className="ps-10 h-11 rounded-sm border-border/70 focus-visible:ring-primary/40"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/80" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="ps-10 pe-10 h-11 rounded-sm border-border/70 focus-visible:ring-primary/40"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-manipulation"
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full btn-gold rounded-sm h-11 text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ms-2 h-5 w-5 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>

            <div className="mt-7 pt-5 border-t border-border/60 text-center space-y-3">
              <p className="text-xs sm:text-sm text-muted-foreground">
                للحصول على بيانات الدخول، تواصل مع المسؤول
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-gold-dark transition-colors touch-manipulation"
              >
                <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
                العودة للموقع
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
