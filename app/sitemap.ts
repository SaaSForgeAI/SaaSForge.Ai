import type { MetadataRoute } from 'next';
import { readDb } from '@/lib/store';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await readDb();
  const staticRoutes = ['/', '/pricing', '/templates', '/docs', '/changelog', '/privacy', '/terms'];
  const templateRoutes = db.templates.map((template) => `/templates/${template.category.toLowerCase().replace(/\s+/g, '-')}`);
  return [...staticRoutes, ...templateRoutes].map((url) => ({ url: `https://saasforge.local${url}`, lastModified: new Date() }));
}
