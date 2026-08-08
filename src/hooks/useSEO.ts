import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  lang?: 'ar' | 'en';
}

export const useSEO = ({
  title,
  description,
  keywords,
  ogImage,
  canonical,
  noindex = false,
  lang = 'ar',
}: SEOProps) => {
  useEffect(() => {
    document.title = title;
    document.documentElement.lang = lang;

    updateMetaTag('name', 'description', description);

    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }

    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:locale', lang === 'ar' ? 'ar_AE' : 'en_AE');
    updateMetaTag(
      'property',
      'og:locale:alternate',
      lang === 'ar' ? 'en_AE' : 'ar_AE'
    );
    updateMetaTag('property', 'og:site_name', 'AL GENERAL CAR RENTAL');

    if (canonical) {
      updateMetaTag('property', 'og:url', canonical);
      updateLinkTag('canonical', canonical);
    }

    const image = ogImage || 'https://algenral.vercel.app/logo.png';
    updateMetaTag('property', 'og:image', image);
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', image);

    updateMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  }, [title, description, keywords, ogImage, canonical, noindex, lang]);
};

const updateMetaTag = (attribute: string, value: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${value}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
};
