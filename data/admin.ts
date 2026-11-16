export const adminStats = [
  { label: 'کاربران فعال (نمایشی)', value: 12840, kind: 'number' as const },
  { label: 'فروشگاه‌های تاییدشده', value: 8, kind: 'number' as const },
  { label: 'حجم معاملات ماه (نمایشی)', value: 512000000, kind: 'currency' as const },
  { label: 'کارمزد پلتفرم (نمایشی)', value: 76800000, kind: 'currency' as const },
];

export const customers = [
  { id: 'c-01', name: 'نگار رضایی', phone: '۰۹۱۲···۱۲۳۴', orders: 14, status: 'active' as const, joinedAt: '2026-02-11' },
  { id: 'c-02', name: 'علی کریمی', phone: '۰۹۳۵···۸۸۷۰', orders: 3, status: 'active' as const, joinedAt: '2026-06-02' },
  { id: 'c-03', name: 'سارا موسوی', phone: '۰۹۱۹···۴۵۶۱', orders: 9, status: 'restricted' as const, joinedAt: '2026-04-19' },
  { id: 'c-04', name: 'امیر حسینی', phone: '۰۹۱۰···۰۰۹۲', orders: 1, status: 'active' as const, joinedAt: '2026-10-30' },
];

export const merchantApplications = [
  { id: 'ap-01', name: 'کیک‌خانه شب‌بو', category: 'شیرینی و دسر', city: 'تهران', submittedAt: '2026-11-14', documents: 'کامل' },
  { id: 'ap-02', name: 'بیکری گندم‌زار', category: 'نانوایی و بیکری', city: 'تهران', submittedAt: '2026-11-15', documents: 'نیاز به بررسی' },
  { id: 'ap-03', name: 'کافه ساحل', category: 'کافه', city: 'تهران', submittedAt: '2026-11-16', documents: 'کامل' },
];

export const productReviews = [
  { id: 'pr-01', product: 'بسته سبزیجات تازه', store: 'میوه و سبزی سبز', reason: 'اطلاعات نگهداری ناقص', status: 'pending' as const },
  { id: 'pr-02', product: 'انتخاب آشپز امروز', store: 'رستوران کرم', reason: 'نیاز به ثبت اطلاعات آلرژن', status: 'pending' as const },
  { id: 'pr-03', product: 'جعبه شیرینی متنوع', store: 'شیرینی‌سرای لاله', reason: 'بررسی قیمت', status: 'approved' as const },
];

export const paymentsLog = [
  { id: 'PAY-9001', order: 'GZ-7421', amount: 110000, method: 'درگاه پرداخت', status: 'successful' as const, at: '2026-11-16 ۱۰:۱۵' },
  { id: 'PAY-9002', order: 'GZ-6988', amount: 170000, method: 'درگاه پرداخت', status: 'successful' as const, at: '2026-11-15 ۰۹:۴۰' },
  { id: 'PAY-9003', order: 'GZ-6120', amount: 89000, method: 'درگاه پرداخت', status: 'failed' as const, at: '2026-11-07 ۲۱:۲۰' },
];

export const refundRequests = [
  { id: 'RF-310', order: 'GZ-6120', customer: 'امیر حسینی', amount: 89000, reason: 'لغو سفارش توسط فروشگاه', status: 'pending' as const },
  { id: 'RF-311', order: 'GZ-6512', customer: 'نگار رضایی', amount: 139000, reason: 'تاخیر در تحویل', status: 'approved' as const },
];

export const commissionRules = [
  { category: 'نانوایی و بیکری', rate: 12 },
  { category: 'کافه', rate: 12 },
  { category: 'شیرینی و دسر', rate: 14 },
  { category: 'رستوران', rate: 15 },
  { category: 'فست‌فود', rate: 15 },
  { category: 'خواربار و سوپرمارکت', rate: 10 },
  { category: 'آبمیوه و نوشیدنی', rate: 12 },
  { category: 'خرده‌فروشی و سبک زندگی', rate: 18 },
];

export const deliveryRequests = [
  { id: 'DL-552', order: 'GZ-6512', courier: 'تیم ارسال گنجینه', area: 'یوسف‌آباد', status: 'delivered' as const },
  { id: 'DL-553', order: 'GZ-7421', courier: 'در انتظار تخصیص', area: 'ونک', status: 'waiting' as const },
  { id: 'DL-554', order: 'GZ-6988', courier: 'مسیر شماره ۲', area: 'نیاوران', status: 'on_way' as const },
];

export const coupons = [
  { code: 'AVALIN', description: 'کاربران جدید (نمایشی)', discount: 10, active: true, uses: 124 },
  { code: 'PAIZ', description: 'سفارش‌های پاییزی (نمایشی)', discount: 15, active: true, uses: 58 },
  { code: 'BAHAR', description: 'کمپین بهار (منقضی)', discount: 20, active: false, uses: 301 },
];

export const complaints = [
  { id: 'CP-75', subject: 'محصول با تاخیر تحویل شد', party: 'مشتری', priority: 'high' as const, status: 'open' as const },
  { id: 'CP-76', subject: 'اطلاعات آلرژن ناقص است', party: 'مشتری', priority: 'high' as const, status: 'in_review' as const },
  { id: 'CP-77', subject: 'درخواست تغییر حساب بانکی', party: 'فروشگاه', priority: 'normal' as const, status: 'open' as const },
];

export const adminCategories = [
  { name: 'نانوایی و بیکری', stores: 1, products: 2, active: true },
  { name: 'کافه', stores: 1, products: 1, active: true },
  { name: 'شیرینی و دسر', stores: 1, products: 2, active: true },
  { name: 'رستوران', stores: 1, products: 2, active: true },
  { name: 'فست‌فود', stores: 1, products: 1, active: true },
  { name: 'خواربار و سوپرمارکت', stores: 1, products: 1, active: true },
  { name: 'آبمیوه و نوشیدنی', stores: 1, products: 2, active: true },
  { name: 'خرده‌فروشی و سبک زندگی', stores: 1, products: 1, active: false },
];
