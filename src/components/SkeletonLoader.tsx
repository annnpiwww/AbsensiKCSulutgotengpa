import React from 'react';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[var(--md-sys-color-surface-container-highest)] rounded-xl opacity-75 ${className}`} />
);

export const KpiSkeletonGrid: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="bg-[var(--md-sys-color-surface-container-lowest)] p-5 rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs space-y-3"
      >
        <div className="flex justify-between items-center">
          <SkeletonBox className="h-4 w-28" />
          <SkeletonBox className="h-9 w-9 rounded-2xl" />
        </div>
        <SkeletonBox className="h-9 w-24" />
        <SkeletonBox className="h-2 w-full rounded-full" />
        <SkeletonBox className="h-3 w-36" />
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-[var(--md-sys-color-surface-container-lowest)] rounded-2xl border border-[var(--md-sys-color-outline-variant)] shadow-xs overflow-hidden">
    <div className="p-4 bg-[var(--md-sys-color-surface-container-low)] border-b border-[var(--md-sys-color-outline-variant)] flex justify-between items-center">
      <SkeletonBox className="h-8 w-64 rounded-full" />
      <SkeletonBox className="h-8 w-40 rounded-full" />
    </div>
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex items-center gap-4 py-2 border-b border-[var(--md-sys-color-outline-variant)]">
          <SkeletonBox className="h-4 w-20" />
          <SkeletonBox className="h-4 w-36" />
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-4 w-28" />
          <SkeletonBox className="h-6 w-20 rounded-full" />
          <SkeletonBox className="h-4 w-32" />
        </div>
      ))}
    </div>
  </div>
);

export const AnalyticsSkeleton: React.FC = () => (
  <div className="space-y-5">
    <SkeletonBox className="h-20 w-full rounded-2xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkeletonBox className="h-28 w-full rounded-2xl" />
      <SkeletonBox className="h-28 w-full rounded-2xl" />
    </div>
    <SkeletonBox className="h-96 w-full rounded-2xl" />
  </div>
);
