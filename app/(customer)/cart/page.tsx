import { ButtonLink } from '@/components/shared/ButtonLink';
import { EmptyState } from '@/components/shared/Feedback';
import { DemoNotice, PageHeader } from '@/components/shared/PageHeader';

export default function CartPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 md:px-8">
      <PageHeader title="سبد خرید" description="محصولاتی که برای خرید انتخاب کرده‌اید اینجا نمایش داده می‌شوند." />
      <EmptyState
        title="سبد خرید شما خالی است"
        description="محصولی را که دوست دارید انتخاب کنید تا قیمت، بازه جمع‌آوری و نحوه دریافت آن اینجا مرور شود."
        action={<ButtonLink href="/explore">کاوش محصولات</ButtonLink>}
      />
      <DemoNotice>پرداخت در این نسخه فعال نیست. سبد خرید فقط ساختار صفحه را نشان می‌دهد.</DemoNotice>
    </div>
  );
}
