// src/maincomponents/skeletons/ChartSkeleton.jsx
import React from 'react';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent, CardHeader } from '../components/ui/card';

const ChartSkeleton = ({ type = 'bar', isRTL = false, className = '' }) => {
  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br from-white via-white to-gray-50/80 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900/80 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-4">
        <Skeleton className={`h-6 w-48 ${isRTL ? 'ml-auto' : ''}`} />
      </CardHeader>
      <CardContent className="p-6">
        {type === 'pie' ? (
          // Pie Chart Skeleton
          <div className="flex flex-col items-center justify-center gap-6">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
            {/* Legend Skeleton */}
            <div className="flex flex-wrap gap-4 justify-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-sm" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Bar Chart Skeleton
          <div className="space-y-4">
            {/* Chart Area */}
            <div className="flex items-end justify-between gap-2 h-[250px]">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <Skeleton 
                  key={i} 
                  className="w-full" 
                  style={{ 
                    height: `${Math.random() * 60 + 40}%`,
                    minHeight: '40%'
                  }} 
                />
              ))}
            </div>
            {/* X-Axis Labels */}
            <div className="flex items-center justify-between gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <Skeleton key={i} className="h-3 w-8" />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartSkeleton;