import { PageHeader } from '@/components/shared/PageHeader';
import { ListingForm } from '@/features/merchant/listing/ListingForm';

export default function NewListingPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="ثبت محصول جدید" description="اطلاعات بسته را وارد کنید. ثبت‌ها در این نسخه نمایشی هستند و ذخیره نمی‌شوند." />
      <ListingForm />
    </div>
  );
}
