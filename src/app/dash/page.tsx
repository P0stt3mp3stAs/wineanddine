'use client';
import DashboardHero from '@/components/DashboardHero';
import ReservationSection from '@/components/ReservationSection';
import MenuPreview from '@/components/menu/MenuPreview';
export default function Dash() {

  return (
    <main>
      <DashboardHero />
      <MenuPreview />
      <ReservationSection />
    </main>
  );
}