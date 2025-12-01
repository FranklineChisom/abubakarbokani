import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/preview/'], // Hide admin and preview routes
    },
    sitemap: 'https://abubakarbokani.com/sitemap.xml',
  };
}