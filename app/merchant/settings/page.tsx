import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { getStore } from '@/data/lookup';
import { merchantStore } from '@/data/merchant';
import { inputClass, labelClass } from '@/features/dashboard/form-styles';

export default function MerchantSettingsPage() {
  const store = getStore(merchantStore.storeId);
  if (!store) return null;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="تنظیمات فروشگاه" description="زمان‌های کاری، روش‌های تحویل و اطلاعات تماس فروشگاه." />
      <DemoNotice>تغییرات این صفحه ذخیره نمی‌شوند و فقط نمایشی هستند.</DemoNotice>

      <div className="grid gap-6 rounded-2xl border border-ink-800 bg-ink-900 p-6 md:grid-cols-2">
        <label className={labelClass}>
          نام فروشگاه
          <input defaultValue={store.name} className={inputClass} />
        </label>
        <label className={labelClass}>
          ساعت کاری
          <input defaultValue={store.hours} className={inputClass} />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          نشانی
          <input defaultValue={store.address} className={inputClass} />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          توضیحات تحویل حضوری
          <input defaultValue={store.pickupInstructions} className={inputClass} />
        </label>
        <label className={labelClass}>
          هزینه ارسال (تومان)
          <input defaultValue={store.deliveryFee} inputMode="numeric" className={inputClass} />
        </label>
        <label className={labelClass}>
          مناطق ارسال
          <input defaultValue={store.deliveryAreas.join('، ')} className={inputClass} />
        </label>
        <div className="flex justify-end border-t border-ink-800 pt-6 md:col-span-2">
          <DemoActionButton label="ذخیره تغییرات" message="ذخیره تنظیمات در نسخه نمایشی انجام نمی‌شود." variant="primary" />
        </div>
      </div>
    </div>
  );
}
