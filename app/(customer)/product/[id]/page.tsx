import { notFound } from 'next/navigation';
import { ProductDetailView } from '@/features/customer/product/ProductDetailView';
import { getProduct, getStore } from '@/data/lookup';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);
  const store = product ? getStore(product.storeId) : undefined;
  if (!product || !store) notFound();

  return <ProductDetailView product={product} store={store} />;
}
