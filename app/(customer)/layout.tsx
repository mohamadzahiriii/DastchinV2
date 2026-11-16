import { CustomerBottomNav, CustomerHeader } from '@/features/customer/layout/CustomerNavigation';
import { CustomerFooter } from '@/features/customer/layout/CustomerFooter';
import { FirstTimeLocationPrompt } from '@/features/location/LocationSwitcher';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ink-950">
      <CustomerHeader />
      <FirstTimeLocationPrompt />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <CustomerFooter />
      <CustomerBottomNav />
    </div>
  );
}
