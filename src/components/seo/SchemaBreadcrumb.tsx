import { useEffect } from 'react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SchemaBreadcrumbProps {
  items: BreadcrumbItem[];
}

export const SchemaBreadcrumb = ({ items }: SchemaBreadcrumbProps) => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `https://algenral.vercel.app${item.url}`
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-breadcrumb';
    
    // Remove existing schema if present
    const existing = document.getElementById('schema-breadcrumb');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const schemaScript = document.getElementById('schema-breadcrumb');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [items]);

  return null;
};