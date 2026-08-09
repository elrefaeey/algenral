import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSEO } from '@/hooks/useSEO';
import { SchemaBreadcrumb } from '@/components/seo/SchemaBreadcrumb';
import { SchemaArticle } from '@/components/seo/SchemaArticle';
import { getBlogPostBySlug, getBlogPost } from '@/services/firebaseService';
import { BlogPost } from '@/types';
import {
  getCanonicalUrl,
  getBlogPath,
  generateBlogTitle,
  generateBlogDescription,
  generateBlogKeywords,
  toAbsoluteUrl,
} from '@/utils/seoHelpers';

function renderParagraphs(content: string) {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, i) => (
      <p key={i} className="text-muted-foreground leading-relaxed mb-4 last:mb-0 whitespace-pre-line">
        {block}
      </p>
    ));
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);

    const load = async () => {
      let data = await getBlogPostBySlug(slug);
      if (!data) data = await getBlogPost(slug);
      if (!data || !data.published) {
        setNotFound(true);
        setPost(null);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    load();
  }, [slug]);

  const title = post ? (lang === 'ar' ? post.titleAr : post.title) : '';
  const content = post ? (lang === 'ar' ? post.contentAr : post.content) : '';
  const seoTitle = post ? generateBlogTitle(post, lang) : t.blog.title;
  const seoDesc = post ? generateBlogDescription(post, lang) : '';
  const seoKeywords = post ? generateBlogKeywords(post, lang) : undefined;
  const canonical = post ? getCanonicalUrl(getBlogPath(post)) : getCanonicalUrl('/blog');

  useSEO({
    title: seoTitle,
    description: seoDesc || t.blog.subtitle,
    keywords: seoKeywords,
    canonical,
    ogImage: post?.coverImage ? toAbsoluteUrl(post.coverImage) : undefined,
    lang,
    ogType: 'article',
    noindex: notFound,
  });

  const formatDate = useMemo(
    () => (date?: Date) => {
      if (!date) return '';
      return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-AE' : 'en-AE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    },
    [lang]
  );

  return (
    <Layout>
      {post && (
        <>
          <SchemaArticle post={post} lang={lang} />
          <SchemaBreadcrumb
            items={[
              { name: t.nav.home, url: '/' },
              { name: t.nav.blog, url: '/blog' },
              { name: title, url: getBlogPath(post) },
            ]}
          />
        </>
      )}

      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : notFound || !post ? (
        <div className="section-container py-20 text-center">
          <h1 className="text-2xl font-bold mb-3">{t.blog.notFound}</h1>
          <Link to="/blog" className="text-primary font-semibold inline-flex items-center gap-1">
            {t.blog.back}
            <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
          </Link>
        </div>
      ) : (
        <article>
          <section className="page-band py-10 sm:py-14">
            <div className="section-container max-w-3xl">
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-xs tracking-[0.14em] uppercase text-muted-foreground hover:text-primary mb-5"
              >
                <ChevronLeft className="w-3.5 h-3.5 ltr:rotate-180" />
                {t.blog.back}
              </Link>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <p className="section-eyebrow mb-3">{t.blog.eyebrow}</p>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
                  {title}
                </h1>
                {(post.publishedAt || post.createdAt) && (
                  <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </p>
                )}
              </motion.div>
            </div>
          </section>

          {post.coverImage ? (
            <div className="section-container max-w-4xl -mt-2 sm:-mt-4 mb-8 sm:mb-10">
              <div className="aspect-[16/9] overflow-hidden bg-muted border border-border/40">
                <img
                  src={toAbsoluteUrl(post.coverImage)}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : null}

          <section className="pb-14 sm:pb-20">
            <div className="section-container max-w-3xl">
              <div className="prose-algeneral text-base sm:text-[1.05rem]">
                {renderParagraphs(content)}
              </div>

              <div className="mt-10 pt-8 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
                  {t.blog.back}
                </Link>
                <Link
                  to="/cars"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary"
                >
                  {t.nav.bookNow}
                  <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
                </Link>
              </div>
            </div>
          </section>
        </article>
      )}
    </Layout>
  );
};

export default BlogPostPage;
