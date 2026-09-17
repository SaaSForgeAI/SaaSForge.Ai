import { PricingClient } from '@/features/pricing/pricing-client';
import { SiteFooter } from '@/components/marketing/site-footer';
import { SiteHeader } from '@/components/marketing/site-header';

export default function PricingPage() {
  return (
    <div>
      <SiteHeader />
      <PricingClient />
      <SiteFooter />
    </div>
  );
}
