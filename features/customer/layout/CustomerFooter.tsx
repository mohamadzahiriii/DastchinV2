import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { brand } from '@/config/brand';

const footerLinks = [
  { title: 'کاوش', links: [
    { label: 'محصولات امروز', href: '/explore' },
    { label: 'دسته‌بندی‌ها', href: '/categories' },
    { label: 'فروشگاه‌ها', href: '/stores' },
  ] },
  { title: 'حساب و سفارش', links: [
    { label: 'سفارش‌های من', href: '/orders' },
    { label: 'علاقه‌مندی‌ها', href: '/favorites' },
    { label: 'پشتیبانی', href: '/profile#support' },
  ] },
  { title: 'برای فروشگاه‌ها', links: [
    { label: 'ورود فروشگاه', href: '/merchant' },
    { label: 'پنل مدیریت', href: '/admin' },
  ] },
];

export function CustomerFooter() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950 pb-24 pt-16 md:pb-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-4 md:px-8">
        <div className="flex flex-col gap-4 md:col-span-1">
          <Logo />
          <p className="text-sm leading-relaxed text-ink-300">{brand.description}</p>
        </div>
        {footerLinks.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-ink-50">{group.title}</h4>
            <ul className="flex flex-col gap-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ink-300 transition-colors hover:text-saffron-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-2 border-t border-ink-800 px-4 pt-6 text-xs text-ink-400 md:flex-row md:justify-between md:px-8">
        <p>{brand.tagline}</p>
        <p>نسخه نمایشی فاز ۱ · فروشگاه‌ها، محصولات و سفارش‌ها نمونه هستند و با شرکای واقعی پلتفرم ارتباطی ندارند.</p>
      </div>
    </footer>
  );
}
