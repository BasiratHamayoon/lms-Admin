// src/maincomponents/skeletons/QuickActionsSkeleton.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';

const QuickActionsSkeleton = () => {
  return (
    <Card className="h-full border-0 shadow-lg bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/80 backdrop-blur-sm py-2">
      <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-700">
        <CardTitle className="flex items-center gap-3">
          <div className="w-3 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg"></div>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-8 ml-auto rounded-full" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-full min-h-[140px] p-5 flex flex-col items-center justify-between border-2 border-gray-200/80 dark:border-gray-600/80 rounded-lg bg-white/60 dark:bg-gray-700/60"
            >
              <div className="flex flex-col items-center gap-4 flex-1 w-full">
                <Skeleton className="w-16 h-16 rounded-2xl" />
                <div className="flex-1 text-center space-y-2 w-full">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4 mx-auto" />
                </div>
              </div>
              <Skeleton className="w-8 h-8 rounded-full mt-3" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsSkeleton;