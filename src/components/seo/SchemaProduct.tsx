import { useEffect } from 'react';
import { Car } from '@/types';
import { formatPrice } from '@/utils/seoHelpers';

interface SchemaProductProps {
  car: Car;
}

export const SchemaProduct = ({ car }: SchemaProductProps) => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `https://algenral.vercel.app/cars/${car.id}`,
      "name": car.nameAr,
      "alternateName": car.name,
      "description": car.descriptionAr,
      "category": "Vehicle Rental",
      "brand": {
        "@type": "Brand",
        "name": car.name.split(' ')[0] // Extract brand from car name
      },
      "model": car.name,
      "vehicleModelDate": car.year.toString(),
      "image": car.images.map(img => `https://algenral.vercel.app${img}`),
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "AED",
        "lowPrice": car.priceDaily,
        "highPrice": car.priceMonthly,
        "offerCount": "3",
        "offers": [
          {
            "@type": "Offer",
            "name": "إيجار يومي",
            "price": car.priceDaily,
            "priceCurrency": "AED",
            "availability": car.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "validFrom": new Date().toISOString(),
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            "seller": {
              "@type": "Organization",
              "name": "AL GENERAL CAR RENTAL"
            }
          },
          {
            "@type": "Offer",
            "name": "إيجار أسبوعي",
            "price": car.priceWeekly,
            "priceCurrency": "AED",
            "availability": car.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "validFrom": new Date().toISOString(),
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            "seller": {
              "@type": "Organization",
              "name": "AL GENERAL CAR RENTAL"
            }
          },
          {
            "@type": "Offer",
            "name": "إيجار شهري",
            "price": car.priceMonthly,
            "priceCurrency": "AED",
            "availability": car.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "validFrom": new Date().toISOString(),
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            "seller": {
              "@type": "Organization",
              "name": "AL GENERAL CAR RENTAL"
            }
          }
        ]
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "عدد الركاب",
          "value": car.passengers.toString()
        },
        {
          "@type": "PropertyValue",
          "name": "نوع الوقود",
          "value": car.fuelType
        },
        {
          "@type": "PropertyValue",
          "name": "ناقل الحركة",
          "value": car.transmission
        }
      ],
      "manufacturer": {
        "@type": "Organization",
        "name": car.name.split(' ')[0]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = `schema-product-${car.id}`;
    
    // Remove existing schema if present
    const existing = document.getElementById(`schema-product-${car.id}`);
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const schemaScript = document.getElementById(`schema-product-${car.id}`);
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [car]);

  return null;
};