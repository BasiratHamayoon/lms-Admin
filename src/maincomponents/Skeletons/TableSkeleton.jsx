// src/maincomponents/skeletons/TableSkeleton.jsx
import React from 'react';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const TableSkeleton = ({ columns = 6, rows = 5, showFilters = true }) => {
  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="flex flex-col gap-4">
          {/* Title Row */}
          <div className="flex items-center gap-3">
            <Skeleton className="w-3 h-8 rounded-full" />
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>

          {/* Filters Row */}
          {showFilters && (
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1 max-w-md" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
              <TableRow className="hover:bg-transparent">
                {Array.from({ length: columns }).map((_, index) => (
                  <TableHead key={index} className="py-4 px-6">
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: rows }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-b border-gray-100 dark:border-gray-800">
                  {Array.from({ length: columns }).map((_, colIndex) => (
                    <TableCell key={colIndex} className="py-4 px-6">
                      {colIndex === 0 ? (
                        <Skeleton className="h-4 w-8" />
                      ) : colIndex === 1 ? (
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ) : colIndex === columns - 1 ? (
                        <div className="flex items-center justify-center gap-1">
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      ) : (
                        <Skeleton className="h-4 w-24" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Skeleton */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableSkeleton;