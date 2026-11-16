import { DashboardShell } from '@/features/dashboard/DashboardShell';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell variant="merchant">{children}</DashboardShell>;
}
