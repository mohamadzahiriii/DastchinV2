import type { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'bakery',
    name: 'نانوایی و بیکری',
    description: 'نان تازه، بریوش و شیرینی‌های صبحانه',
    image: 'https://images.pexels.com/photos/35993723/pexels-photo-35993723.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    iconKey: 'wheat',
  },
  {
    id: 'cafe',
    name: 'کافه',
    description: 'قهوه، کیک و نوشیدنی‌های کافه',
    image: 'https://images.pexels.com/photos/39047893/pexels-photo-39047893.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    iconKey: 'coffee',
  },
  {
    id: 'desserts',
    name: 'شیرینی و دسر',
    description: 'جعبه شیرینی، کیک و دسرهای ویژه',
    image: 'https://images.pexels.com/photos/39240989/pexels-photo-39240989.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    iconKey: 'cake',
  },
  {
    id: 'restaurant',
    name: 'رستوران',
    description: 'غذای آماده و وعده‌های ویژه روز',
    image: 'https://images.pexels.com/photos/6327536/pexels-photo-6327536.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    iconKey: 'utensils',
  },
  {
    id: 'fast-food',
    name: 'فست‌فود',
    description: 'برگر، سیب‌زمینی و وعده‌های سریع',
    image: 'https://images.pexels.com/photos/1137473/pexels-photo-1137473.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    iconKey: 'sandwich',
  },
  {
    id: 'grocery',
    name: 'خواربار و سوپرمارکت',
    description: 'سبزیجات، میوه و مواد غذایی تازه',
    image: 'https://images.pexels.com/photos/33975355/pexels-photo-33975355.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    iconKey: 'shopping-basket',
  },
  {
    id: 'drinks',
    name: 'آبمیوه و نوشیدنی',
    description: 'آبمیوه تازه، اسموتی و نوشیدنی‌های سرد',
    image: 'https://images.pexels.com/photos/17612822/pexels-photo-17612822.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    iconKey: 'glass-water',
  },
  {
    id: 'retail',
    name: 'خرده‌فروشی و سبک زندگی',
    description: 'بوتیک‌ها و کالاهای منتخب با موجودی محدود',
    image: 'https://images.pexels.com/photos/5531709/pexels-photo-5531709.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    iconKey: 'shopping-bag',
  },
];
