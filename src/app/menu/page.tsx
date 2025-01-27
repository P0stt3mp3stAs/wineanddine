import { Suspense } from 'react';
import MenuContent from '@/components/MenuContent';

export default function Menu() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuContent />
    </Suspense>
  );
}