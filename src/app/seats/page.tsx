'use client';

import React, { Suspense } from 'react';
import RestaurantModel from '@/components/RestaurantModel';
export default function SeatsPage() {
  return (
    <Suspense>
      <RestaurantModel />
    </Suspense>
  );
}