import { useEffect } from 'react';

export const SchemaLocalBusiness = () => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://algenral.vercel.app/#localbusiness",
      "name": "AL GENERAL CAR RENTAL",
      "alternateName": "الچينرال لتأجير السيارات",
      "description": "شركة تأجير سيارات في دبي تقدم خدمات تأجير السيارات الفاخرة والاقتصادية بأسعار تنافسية",
      "url": "https://algenral.vercel.app",
      "telephone": "+971-XX-XXX-XXXX",
      "priceRange": "$$",
      "currenciesAccepted": "AED",
      "paymentAccepted": "Cash, Credit Card",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "دبي، الإمارات العربية المتحدة",
        "addressLocality": "دبي",
        "addressRegion": "دبي",
        "addressCountry": "AE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "25.2048",
        "longitude": "55.2708"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", 
          "Friday", "Saturday", "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      },
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": "25.2048",
          "longitude": "55.2708"
        },
        "geoRadius": "50000"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "خدمات تأجير السيارات",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "تأجير سيارات يومي",
              "description": "خدمة تأجير السيارات لفترات قصيرة"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "تأجير سيارات شهري",
              "description": "خدمة تأجير السيارات لفترات طويلة"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "توصيل للمطار",
              "description": "خدمة توصيل السيارات للمطار مجاناً"
            }
          }
        ]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-localbusiness';
    
    // Remove existing schema if present
    const existing = document.getElementById('schema-localbusiness');
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const schemaScript = document.getElementById('schema-localbusiness');
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, []);

  return null;
};