'use client';

import { HomeHero } from '@/features/customer/home/HomeHero';
import {
  DailyOpportunities,
  EditorialBanners,
  FeaturedMerchants,
  HowItWorks,
  LimitedAvailability,
  MerchantCallout,
  NearbyStoresSection,
  NearbyProductsSection,
  AreaDiscountsSection,
  TodayPickupSection,
  OutOfRangeStoresSection,
  NewArrivals,
  PopularCategories,
} from '@/features/customer/home/HomeSections';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <NearbyStoresSection />
      <NearbyProductsSection />
      <AreaDiscountsSection />
      <PopularCategories />
      <LimitedAvailability />
      <TodayPickupSection />
      <DailyOpportunities />
      <FeaturedMerchants />
      <OutOfRangeStoresSection />
      <EditorialBanners />
      <NewArrivals />
      <HowItWorks />
      <MerchantCallout />
    </>
  );
}
