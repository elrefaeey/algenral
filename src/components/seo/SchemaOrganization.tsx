import { useEffect } from 'react';

export const SchemaOrganization = () => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "AL GENERAL CAR RENTAL",
      "alternateName": "الچينرال لتأجير السيارات",
      "url": "https://algenral.vercel.app",
      "logo": "https://algenral.vercel.app/src/assets/logo.png",
      "description": "شركة رائدة في تأجير السيارات في دبي والإمارات العربية المتحدة",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "دبي، الإمارات العربية المتحدة",
        "addressLocality": "دبي",
        "addressCountry": "AE"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+971-XX-XXX-XXXX",
        "contactType": "customer service",
        "availableLanguage": ["Arabic", "English"],
        "hoursAvailable": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday", "Tuesday", "Wednesday", "Thursday", 
            "Friday", "Saturday", "Sunday"
          ],
          "opens": "00:00",
          "closes": "23:59"
        }
      },
      "sameAs": [
        "https://wa.me/971XXXXXXXXX"
      ],
      "serviceArea": {
        "@type": "Place",
        "name": "Dubai, UAE"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-organization';
    
    // Remove existing schema if present
    const existing = document.getElementById('schema-organization');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const schemaScript = document.getElementById('schema-organization');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, []);

  return null;
};