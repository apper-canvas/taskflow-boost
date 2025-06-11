import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = () => {
  return (
    <div className="h-full p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
        {/* Category Sidebar Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-12 p-4 shadow-sm">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-surface-200 rounded w-20"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-8 bg-surface-200 rounded-20"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Task List Skeleton */}
        <div className="lg:col-span-8">
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-12 bg-white rounded-12 shadow-sm"></div>
            </div>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="bg-white rounded-12 p-6 shadow-sm">
                  <div className="animate-pulse space-y-3">
                    <div className="h-5 bg-surface-200 rounded w-3/4"></div>
                    <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                    <div className="h-4 bg-surface-200 rounded w-1/4"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Panel Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-12 p-4 shadow-sm">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-surface-200 rounded w-16"></div>
              <div className="h-16 bg-surface-200 rounded-12"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-8 bg-surface-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;