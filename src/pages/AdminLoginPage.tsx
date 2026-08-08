import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
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
    } catch (error: any) {
      const errorMessage =
        error.code === 'auth/invalid-credential'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : 'حدث خطأ. يرجى المحاولة مرة أخرى';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 80% 20%, hsl(36 42% 46% / 0.25), transparent), radial-gradient(ellipse 50% 40% at 10% 90%, hsl(36 42% 46% / 0.1), transparent)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-md border border-white/10 bg-background/95 backdrop-blur-md p-8 shadow-medium">
          <div className="text-center mb-8">
            <p className="font-display text-4xl tracking-[0.16em] text-foreground">AL GENERAL</p>
            <div className="luxury-divider my-4 w-14" />
            <h1 className="text-xl font-bold text-foreground">لوحة الإدارة</h1>
            <p className="text-muted-foreground mt-1 text-sm">الچينرال لتأجير السيارات</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pr-10 rounded-md"
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
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pr-10 pl-10 rounded-md"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full btn-gold rounded-md py-5" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/60 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              للحصول على بيانات الدخول، تواصل مع المسؤول
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-gold-dark transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              العودة للموقع
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
