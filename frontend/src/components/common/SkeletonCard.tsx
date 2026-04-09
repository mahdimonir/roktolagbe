import { Skeleton, SkeletonCircle, SkeletonText } from './Skeleton';

export function SkeletonCard() {
  return (
    <div className="p-8 rounded-[3.5rem] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <Skeleton className="w-24 h-8 rounded-full" />
        <SkeletonCircle size="w-12 h-12" />
      </div>

      {/* Title & Info */}
      <div className="space-y-4">
        <SkeletonText lines={2} className="w-[80%]" />
        <div className="flex gap-4">
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="space-y-2">
          <Skeleton className="w-12 h-3 rounded-full" />
          <Skeleton className="w-full h-8 rounded-2xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-12 h-3 rounded-full" />
          <Skeleton className="w-full h-8 rounded-2xl" />
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="pt-4 space-y-3">
        <Skeleton className="w-full h-14 rounded-[1.8rem]" />
        <Skeleton className="w-[40%] h-4 mx-auto rounded-full" />
      </div>
    </div>
  );
}
