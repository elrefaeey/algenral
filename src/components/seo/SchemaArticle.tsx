import { useEffect } from 'react';
import { BlogPost } from '@/types';
import { SITE_URL, getBlogPath, toAbsoluteUrl } from '@/utils/seoHelpers';

interface SchemaArticleProps {
  post: BlogPost;
  lang?: 'ar' | 'en';
}

export const SchemaArticle = ({ post, lang = 'ar' }: SchemaArticleProps) => {
  useEffect(() => {
    const title = lang === 'ar' ? post.titleAr : post.title;
    const description =
      lang === 'ar'
        ? post.excerptAr || post.metaDescriptionAr || ''
        : post.excerpt || post.metaDescription || '';
    const path = getBlogPath(post);
    const datePublished = (post.publishedAt || post.createdAt)?.toISOString?.();
    const dateModified = (post.updatedAt || post.publishedAt || post.createdAt)?.toISOString?.();

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      image: post.coverImage ? [toAbsoluteUrl(post.coverImage)] : [`${SITE_URL}/logo.png`],
      datePublished,
      dateModified,
      author: {
        '@type': 'Organization',
        name: 'AL GENERAL CAR RENTAL',
        url: SITE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: 'AL GENERAL CAR RENTAL',
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_URL}${path}`,
      },
      inLanguage: lang === 'ar' ? 'ar-AE' : 'en-AE',
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-article';
    script.text = JSON.stringify(schema);

    const existing = document.getElementById('schema-article');
    if (existing) existing.remove();
    document.head.appendChild(script);

    return () => {
      document.getElementById('schema-article')?.remove();
    };
  }, [post, lang]);

  return null;
};
