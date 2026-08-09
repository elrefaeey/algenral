/**
 * Generates public/sitemap.xml including static pages + cars + published blog posts.
 * Falls back to static pages only if Firebase is unavailable.
 *
 * Usage: node scripts/generate-sitemap.mjs
 */
import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const SITE = 'https://algenral.vercel.app';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || 'AIzaSyCJe1ce-903bEiy1uTxMPDXnHvr2SArqSg',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'appp-ddcaf.firebaseapp.com',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'appp-ddcaf',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'appp-ddcaf.firebasestorage.app',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '634609894893',
  appId: process.env.VITE_FIREBASE_APP_ID || '1:634609894893:web:fe50ad273792972c8113e4',
};

const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/cars', changefreq: 'daily', priority: '0.9' },
  { path: '/blog', changefreq: 'weekly', priority: '0.85' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
];

function urlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="ar" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="en" href="${loc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />
  </url>`;
}

async function fetchDynamicUrls() {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const [carsSnap, postsSnap] = await Promise.all([
      getDocs(collection(db, 'cars')),
      getDocs(collection(db, 'blogPosts')),
    ]);

    const cars = carsSnap.docs.map((docSnap) => {
      const data = docSnap.data();
      const updated = data.updatedAt?.toDate?.() || data.createdAt?.toDate?.();
      const lastmod = updated ? updated.toISOString().slice(0, 10) : today;
      return { id: docSnap.id, lastmod };
    });

    const posts = postsSnap.docs
      .map((docSnap) => {
        const data = docSnap.data();
        if (!data.published) return null;
        const slug = (data.slug || docSnap.id || '').toString().trim();
        if (!slug) return null;
        const updated =
          data.updatedAt?.toDate?.() ||
          data.publishedAt?.toDate?.() ||
          data.createdAt?.toDate?.();
        const lastmod = updated ? updated.toISOString().slice(0, 10) : today;
        return { slug, lastmod };
      })
      .filter(Boolean);

    return { cars, posts };
  } catch (error) {
    console.warn('Sitemap: could not fetch from Firebase — using static pages only.');
    console.warn(error?.message || error);
    return { cars: [], posts: [] };
  }
}

async function main() {
  const { cars, posts } = await fetchDynamicUrls();

  const entries = [
    ...staticPages.map((p) =>
      urlEntry(`${SITE}${p.path === '/' ? '/' : p.path}`, today, p.changefreq, p.priority)
    ),
    ...cars.map((car) => urlEntry(`${SITE}/cars/${car.id}`, car.lastmod, 'weekly', '0.8')),
    ...posts.map((post) =>
      urlEntry(`${SITE}/blog/${post.slug}`, post.lastmod, 'weekly', '0.75')
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;

  const outPath = resolve(root, 'public/sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(
    `Sitemap written: ${outPath} (${staticPages.length} static + ${cars.length} cars + ${posts.length} posts)`
  );
}

main();
