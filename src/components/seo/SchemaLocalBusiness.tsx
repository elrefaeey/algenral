import { useEffect } from 'react';
import { defaultSiteSettings, SiteSettings } from '@/types';
import { SITE_URL } from '@/utils/seoHelpers';

interface SchemaLocalBusinessProps {
  settings?: SiteSettings;
}

export const SchemaLocalBusiness = ({
  settings = defaultSiteSettings,
}: SchemaLocalBusinessProps) => {
  useEffect(() => {
    const phone = settings.phone.replace(/^00/, '+').replace(/\s/g, '');
    const tel = phone.startsWith('+') ? phone : `+${phone}`;

    const schema = {
      '@context': 'https://schema.org',
      '@type': ['LocalBusiness', 'AutoRental'],
      '@id': `${SITE_URL}/#localbusiness`,
      name: settings.companyName,
      alternateName: settings.companyNameAr,
      description:
        'Car rental in Dubai — luxury and economy vehicles, airport delivery, daily weekly monthly hire.',
      url: SITE_URL,
      telephone: tel,
      email: settings.email,
      priceRange: '$$',
      currenciesAccepted: 'AED',
      paymentAccepted: 'Cash, Credit Card',
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        postalCode: '',
        addressCountry: 'AE',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '25.276987',
        longitude: '55.348765',
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '00:00',
        closes: '23:59',
      },
      serviceArea: {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: '25.2048',
          longitude: '55.2708',
        },
        geoRadius: '50000',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Car Rental Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Daily Car Rental Dubai',
              description: 'Short-term car hire across Dubai',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Monthly Car Rental Dubai',
              description: 'Long-term vehicle rental in Dubai',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Dubai Airport Delivery',
              description: 'Car delivery to DXB and citywide locations',
            },
          },
        ],
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-localbusiness';

    const existing = document.getElementById('schema-localbusiness');
    if (existing) existing.remove();
    document.head.appendChild(script);

    return () => {
      document.getElementById('schema-localbusiness')?.remove();
    };
  }, [settings]);

  return null;
};
