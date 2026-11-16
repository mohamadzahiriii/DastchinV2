'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader as Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

export function ProfileGuard({ children }: { children: React.ReactNode }) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login?redirect=/profile');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-400" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
