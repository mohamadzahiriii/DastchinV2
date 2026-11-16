'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Headset, Heart, MapPin, ReceiptText, UserRound } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useSupabase } from '@/lib/auth/use-supabase';
import { ProfileGuard } from '@/features/profile/ProfileGuard';
import { ProfileEditor } from '@/features/profile/ProfileEditor';
import { AddressManager } from '@/features/addresses/AddressManager';
import { PageHeader } from '@/components/shared/PageHeader';
import { OrderStatusBadge } from '@/components/shared/OrderStatusBadge';
import { getProduct } from '@/data/lookup';
import { orders } from '@/data/orders';
import { formatPersianDate, formatToman } from '@/lib/format';
import type { Database } from '@/types/database';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type NotificationRow = Database['public']['Tables']['notifications']['Row'];

function Section({ icon: Icon, title, children }: { icon: typeof UserRound; title: string; children: React.ReactNode }) {
  return (
    <section className="flex scroll-mt-24 flex-col gap-5 rounded-2xl border border-ink-800 bg-ink-900 p-6">
      <h2 className="flex items-center gap-2 text-base font-semibold text-ink-50">
        <Icon className="h-4 w-4 text-saffron-300" aria-hidden /> {title}
      </h2>
      {children}
    </section>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const supabase = useSupabase();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: profileData }, { data: notifData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);
      if (profileData) setProfile(profileData);
      if (notifData) setNotifications(notifData);
      setLoading(false);
    })();
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 md:px-8">
        <PageHeader title="حساب کاربری" description="اطلاعات شخصی، نشانی‌ها و سفارش‌های خود را مدیریت کنید." />
        <div className="flex min-h-[30vh] items-center justify-center text-ink-400">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 md:px-8">
        <PageHeader title="حساب کاربری" />
        <p className="text-sm text-ink-300">پروفایل شما یافت نشد. لطفاً دوباره وارد شوید.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 md:px-8">
      <PageHeader title="حساب کاربری" description="اطلاعات شخصی، نشانی‌ها و سفارش‌های خود را مدیریت کنید." />

      <div className="grid gap-6 md:grid-cols-2">
        <Section icon={UserRound} title="اطلاعات شخصی">
          <ProfileEditor profile={profile} />
        </Section>

        <Section icon={MapPin} title="نشانی‌های ذخیره‌شده">
          <AddressManager />
        </Section>

        <Section icon={ReceiptText} title="تاریخچه سفارش‌ها">
          <ul className="flex flex-col gap-3">
            {orders.slice(0, 3).map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 text-sm">
                <Link href={`/orders/${o.id}`} className="flex flex-col gap-1 text-ink-50 hover:text-saffron-300">
                  {getProduct(o.productId)?.name}
                  <span className="text-xs text-ink-400">{formatPersianDate(o.placedAt)} · {formatToman(o.total)}</span>
                </Link>
                <OrderStatusBadge status={o.status} />
              </li>
            ))}
          </ul>
          <Link href="/orders" className="text-sm font-medium text-saffron-300 hover:underline">همه سفارش‌ها</Link>
        </Section>

        <Section icon={Heart} title="علاقه‌مندی‌ها">
          <p className="text-sm leading-relaxed text-ink-300">محصولات و فروشگاه‌های ذخیره‌شده را در صفحه علاقه‌مندی‌ها ببینید.</p>
          <Link href="/favorites" className="w-fit text-sm font-medium text-saffron-300 hover:underline">مشاهده علاقه‌مندی‌ها</Link>
        </Section>

        <Section icon={Bell} title="اعلان‌ها">
          {notifications.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {notifications.map((n) => (
                <li key={n.id} className="flex flex-col gap-1 text-sm">
                  <span className="text-ink-100">{n.title}</span>
                  {n.body && <span className="text-xs text-ink-400">{n.body}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-300">اعلان جدیدی ندارید.</p>
          )}
        </Section>

        <Section icon={Headset} title="پشتیبانی">
          <p className="text-sm leading-relaxed text-ink-300">
            برای مشکل در سفارش، کیفیت محصول یا اطلاعات نگهداری، درخواست خود را ثبت کنید.
          </p>
          <Link href="/profile" className="w-fit text-sm font-medium text-saffron-300 hover:underline">
            ثبت درخواست پشتیبانی
          </Link>
        </Section>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProfileGuard>
      <ProfileContent />
    </ProfileGuard>
  );
}
