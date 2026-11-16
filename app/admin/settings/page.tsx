import { PageHeader, DemoNotice } from '@/components/shared/PageHeader';
import { DemoActionButton } from '@/components/shared/DemoActionButton';
import { inputClass, labelClass } from '@/features/dashboard/form-styles';

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="تنظیمات پلتفرم" description="اطلاعات پایه پلتفرم و قوانین عمومی سفارش و تحویل." />
      <DemoNotice>تغییرات این صفحه ذخیره نمی‌شوند و فقط نمایشی هستند.</DemoNotice>

      <div className="grid gap-6 rounded-2xl border border-ink-800 bg-ink-900 p-6 md:grid-cols-2">
        <label className={labelClass}>
          نام نمایشی پلتفرم
          <input defaultValue="گنجینه" className={inputClass} />
        </label>
        <label className={labelClass}>
          شهر فعال
          <input defaultValue="تهران" className={inputClass} />
        </label>
        <label className={labelClass}>
          مهلت لغو سفارش توسط مشتری (دقیقه)
          <input defaultValue="30" inputMode="numeric" className={inputClass} />
        </label>
        <label className={labelClass}>
          حداکثر بسته در هر سفارش
          <input defaultValue="3" inputMode="numeric" className={inputClass} />
        </label>
        <div className="flex justify-end border-t border-ink-800 pt-6 md:col-span-2">
          <DemoActionButton label="ذخیره تنظیمات" message="ذخیره تنظیمات در نسخه نمایشی انجام نمی‌شود." variant="primary" />
        </div>
      </div>
    </div>
  );
}
