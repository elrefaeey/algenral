import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { SchemaBreadcrumb } from '@/components/seo/SchemaBreadcrumb';
import { getPublishedBlogPosts } from '@/services/firebaseService';
import { BlogPost } from '@/types';
import {
  getPageSeo,
  getCanonicalUrl,
  getBlogPath,
  toAbsoluteUrl,
} from '@/utils/seoHelpers';

const BlogPage = () => {
  const { t, lang } = useLanguage();
  const pageSeo = getPageSeo('blog', lang);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: pageSeo.title,
    description: pageSeo.description,
    keywords: pageSeo.keywords,
    canonical: getCanonicalUrl('/blog'),
    lang,
  });

  useEffect(() => {
    getPublishedBlogPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-AE' : 'en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Layout>
      <SchemaBreadcrumb
        items={[
          { name: t.nav.home, url: '/' },
          { name: t.nav.blog, url: '/blog' },
        ]}
      />

      <section className="page-band py-10 sm:py-14 md:py-20">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <p className="section-eyebrow mb-2 sm:mb-3">{t.blog.eyebrow}</p>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4">
              {t.blog.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t.blog.subtitle}
            </p>
            {pageSeo.intro ? (
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-xl">
                {pageSeo.intro}
              </p>
            ) : null}
          </motion.div>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-20">
        <div className="section-container">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <p className="text-muted-foreground">{t.blog.empty}</p>
              <Link
                to="/cars"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary"
              >
                {t.nav.cars}
                <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
              {posts.map((post, index) => {
                const title = lang === 'ar' ? post.titleAr : post.title;
                const excerpt = lang === 'ar' ? post.excerptAr : post.excerpt;
                const path = getBlogPath(post);
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(index * 0.05, 0.25) }}
                  >
                    <Link
                      to={path}
                      className="group block h-full border border-border/50 bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-primary/35 hover:shadow-medium overflow-hidden"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-muted">
                        {post.coverImage ? (
                          <img
                            src={toAbsoluteUrl(post.coverImage)}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-muted to-primary/10" />
                        )}
                      </div>
                      <div className="p-4 sm:p-5 flex flex-col gap-2.5">
                        {(post.publishedAt || post.createdAt) && (
                          <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground tracking-wide">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            {formatDate(post.publishedAt || post.createdAt)}
                          </p>
                        )}
                        <h2 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                          {title}
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {excerpt}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                          {t.blog.readMore}
                          <ChevronLeft className="w-4 h-4 ltr:rotate-180 transition-transform group-hover:-translate-x-0.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
