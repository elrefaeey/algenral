import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const SchemaFAQ = () => {
  const { t } = useLanguage();

  useEffect(() => {
    const items = t.faq.items;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-faq';

    const existing = document.getElementById('schema-faq');
    if (existing) existing.remove();
    document.head.appendChild(script);

    return () => {
      document.getElementById('schema-faq')?.remove();
    };
  }, [t.faq.items]);

  return null;
};
