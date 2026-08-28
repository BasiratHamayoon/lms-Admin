import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';

const Shimmer = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-200/50 dark:via-gray-700/50 to-transparent"></div>
);

const SkeletonBlock = ({ className }) => (
  <div className={`relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}>
    <Shimmer />
  </div>
);

const ViewModalSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Generic Header */}
      <Card className="border-0 shadow-none bg-secondary/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <SkeletonBlock className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-3 pt-2">
              <SkeletonBlock className="h-7 w-1/2" />
              <SkeletonBlock className="h-5 w-1/3" />
              <div className="flex flex-wrap gap-4 pt-2">
                <SkeletonBlock className="h-5 w-48" />
                <SkeletonBlock className="h-5 w-32" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generic Info Block 1 */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <SkeletonBlock className="h-6 w-1/4" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                 <SkeletonBlock className="h-10 w-10 rounded-xl" />
                 <div className="w-full space-y-2">
                    <SkeletonBlock className="h-3 w-1/4" />
                    <SkeletonBlock className="h-4 w-3/4" />
                 </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generic Info Block 2 */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <SkeletonBlock className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                 <SkeletonBlock className="h-10 w-10 rounded-xl" />
                 <div className="w-full space-y-2">
                    <SkeletonBlock className="h-3 w-1/4" />
                    <SkeletonBlock className="h-4 w-3/4" />
                 </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewModalSkeleton;