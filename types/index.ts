export type CategoryId =
  | 'bakery'
  | 'cafe'
  | 'desserts'
  | 'restaurant'
  | 'fast-food'
  | 'grocery'
  | 'drinks'
  | 'retail';

export type Category = {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
  iconKey: string;
};

export type Fulfillment = 'pickup' | 'delivery';

export type Store = {
  id: string;
  name: string;
  categoryId: CategoryId;
  neighborhood: string;
  neighborhoodSlug: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  ratingCount: number;
  coverImage: string;
  description: string;
  hours: string;
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  deliveryFee: number;
  deliveryAreas: string[];
  deliveryMaxDistanceKm: number;
  pickupInstructions: string;
  featured: boolean;
  joinedAt: string;
};

export type CollectionWindow = {
  startsAt: string;
  endsAt: string;
};

export type Product = {
  id: string;
  name: string;
  storeId: string;
  categoryId: CategoryId;
  description: string;
  images: string[];
  originalPrice: number;
  price: number;
  contents: string;
  remaining: number;
  maxPerOrder: number;
  collection: CollectionWindow;
  fulfillment: Fulfillment[];
  isSurprise: boolean;
  allergens?: string[];
  storageNote?: string;
  createdAt: string;
};

export type OrderStatus = 'upcoming' | 'ready' | 'completed' | 'cancelled';

export type Order = {
  id: string;
  code: string;
  productId: string;
  storeId: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  fulfillment: Fulfillment;
  placedAt: string;
  collection: CollectionWindow;
};
