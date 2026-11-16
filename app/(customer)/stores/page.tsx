import { PageHeader } from '@/components/shared/PageHeader';
import { StoreCard } from '@/components/shared/StoreCard';
import { stores } from '@/data/stores';

export default function StoresPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 md:px-8">
      <PageHeader
        title="فروشگاه‌ها"
        description="فروشگاه‌های منتخب گنجینه در تهران. هر فروشگاه محصولات امروز خود را با زمان تحویل و اطلاعات مشخص عرضه می‌کند."
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}
