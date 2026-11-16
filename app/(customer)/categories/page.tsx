import { CategoryCard } from '@/components/shared/CategoryCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { categories } from '@/data/categories';

export default function CategoriesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 md:px-8">
      <PageHeader
        title="دسته‌بندی‌ها"
        description="از نانوایی تا آبمیوه‌فروشی؛ هر دسته فرصت‌های خاص خود را دارد. دسته مورد نظر را انتخاب کنید."
      />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
