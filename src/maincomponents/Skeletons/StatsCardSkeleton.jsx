// src/maincomponents/skeletons/StatsCardSkeleton.jsx
import React from 'react';
import { Skeleton } from '../components/ui/skeleton';

const StatsCardSkeleton = () => {
  return (
    <div className="rounded-xl p-6 bg-gray-100 dark:bg-gray-800 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mt-2" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
    </div>
  );
};

export default StatsCardSkeleton;