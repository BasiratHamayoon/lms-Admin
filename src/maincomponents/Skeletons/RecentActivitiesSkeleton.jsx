// src/maincomponents/skeletons/RecentActivitiesSkeleton.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

const RecentActivitiesSkeleton = () => {
  return (
    <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/80 backdrop-blur-sm py-2">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center gap-3">
          <div className="w-3 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg"></div>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-8 ml-auto rounded-full" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700"
            >
              <Skeleton className="h-14 w-14 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-3 w-3 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesSkeleton;