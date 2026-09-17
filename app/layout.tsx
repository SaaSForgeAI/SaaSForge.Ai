import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'SaaSForge AI',
    template: '%s · SaaSForge AI'
  },
  description: 'Build your SaaS with AI. Describe the idea, generate the architecture, ship the UI, database, auth and deployments from one premium workspace.',
  applicationName: 'SaaSForge AI',
  openGraph: {
    title: 'SaaSForge AI',
    description: 'A premium AI SaaS generator for startups, builders and teams.',
    siteName: 'SaaSForge AI',
    type: 'website'
  },
  metadataBase: new URL('https://saasforge.local')
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          id="saasforge-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'SaaSForge AI',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
              offers: [
                { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
                { '@type': 'Offer', name: 'Pro', price: '39', priceCurrency: 'USD' }
              ]
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
