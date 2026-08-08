import { useEffect } from 'react';
import { Car } from '@/types';
import { SITE_URL, toAbsoluteUrl, getCarPath } from '@/utils/seoHelpers';

interface SchemaProductProps {
  car: Car;
}

export const SchemaProduct = ({ car }: SchemaProductProps) => {
  useEffect(() => {
    const path = getCarPath(car);
    const url = `${SITE_URL}${path}`;
    const brandName = car.name.split(' ')[0] || 'AL GENERAL';
    const images = (car.images || []).map((img, i) => ({
      url: toAbsoluteUrl(img),
      alt: car.imageAlts?.[i] || `${car.name} ${car.nameAr}`,
    }));

    const offer: Record<string, unknown> = {
      '@type': 'Offer',
      availability: car.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: 'AED',
      url,
      seller: {
        '@type': 'Organization',
        name: 'AL GENERAL CAR RENTAL',
      },
    };

    if (car.priceDaily > 0) {
      offer.price = car.priceDaily;
      offer.unitText = 'DAY';
      offer.priceValidUntil = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
        .toISOString()
        .slice(0, 10);
    }

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': url,
      name: car.nameAr || car.name,
      alternateName: car.name,
      description: car.descriptionAr || car.description || `Rent ${car.name} in Dubai`,
      category: car.category || 'Vehicle Rental',
      brand: {
        '@type': 'Brand',
        name: brandName,
      },
      model: car.name,
      vehicleModelDate: String(car.year),
      image: images.map((i) => i.url),
      offers: offer,
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'passengers',
          value: String(car.passengers),
        },
        {
          '@type': 'PropertyValue',
          name: 'fuelType',
          value: car.fuelType,
        },
        {
          '@type': 'PropertyValue',
          name: 'transmission',
          value: car.transmission,
        },
        {
          '@type': 'PropertyValue',
          name: 'year',
          value: String(car.year),
        },
      ],
      manufacturer: {
        '@type': 'Organization',
        name: brandName,
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = `schema-product-${car.id}`;

    const existing = document.getElementById(`schema-product-${car.id}`);
    if (existing) existing.remove();
    document.head.appendChild(script);

    return () => {
      document.getElementById(`schema-product-${car.id}`)?.remove();
    };
  }, [car]);

  return null;
};
