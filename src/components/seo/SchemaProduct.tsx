import { useEffect } from 'react';
import { Car } from '@/types';

interface SchemaProductProps {
  car: Car;
}

export const SchemaProduct = ({ car }: SchemaProductProps) => {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `https://algenral.vercel.app/cars/${car.id}`,
      name: car.nameAr,
      alternateName: car.name,
      description: car.descriptionAr,
      category: 'Vehicle Rental',
      brand: {
        '@type': 'Brand',
        name: car.name.split(' ')[0],
      },
      model: car.name,
      vehicleModelDate: car.year.toString(),
      image: car.images.map((img) => `https://algenral.vercel.app${img}`),
      offers: {
        '@type': 'Offer',
        availability: car.available
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        priceCurrency: 'AED',
        url: `https://algenral.vercel.app/cars/${car.id}`,
        seller: {
          '@type': 'Organization',
          name: 'AL GENERAL CAR RENTAL',
        },
      },
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'عدد الركاب',
          value: car.passengers.toString(),
        },
        {
          '@type': 'PropertyValue',
          name: 'نوع الوقود',
          value: car.fuelType,
        },
        {
          '@type': 'PropertyValue',
          name: 'ناقل الحركة',
          value: car.transmission,
        },
      ],
      manufacturer: {
        '@type': 'Organization',
        name: car.name.split(' ')[0],
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = `schema-product-${car.id}`;

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
