import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/auth/',
        '/student-login',
        '/privacy',
        '/terms',
      ],
      disallow: [
        '/onboarding/',
        '/dashboard/',
        '/home',
        '/(app)/',
        '/super-admin/',
        '/api/',
      ],
    },
    sitemap: 'https://amibykoko.app/sitemap.xml',
  };
}
