import { useEffect } from 'react';
import { defaultSiteSettings, SiteSettings } from '@/types';
import { SITE_URL } from '@/utils/seoHelpers';

interface SchemaOrganizationProps {
  settings?: SiteSettings;
}

export const SchemaOrganization = ({
  settings = defaultSiteSettings,
}: SchemaOrganizationProps) => {
  useEffect(() => {
    const phone = settings.phone.replace(/^00/, '+').replace(/\s/g, '');
    const whatsapp = settings.whatsapp.replace(/[^\d]/g, '');

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: settings.companyName,
      alternateName: settings.companyNameAr,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description:
        'Leading car rental company in Dubai — luxury and everyday cars with airport delivery and 24/7 support.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: settings.address,
        addressLocality: 'Dubai',
        addressRegion: 'Dubai',
        addressCountry: 'AE',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: phone.startsWith('+') ? phone : `+${phone}`,
        contactType: 'customer service',
        availableLanguage: ['Arabic', 'English'],
        areaServed: 'AE',
        hoursAvailable: {
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
      },
      email: settings.email,
      sameAs: [`https://wa.me/${whatsapp}`],
      identifier: settings.licenseNumber,
      serviceArea: {
        '@type': 'Place',
        name: 'Dubai, UAE',
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'schema-organization';

    const existing = document.getElementById('schema-organization');
    if (existing) existing.remove();
    document.head.appendChild(script);

    return () => {
      document.getElementById('schema-organization')?.remove();
    };
  }, [settings]);

  return null;
};
