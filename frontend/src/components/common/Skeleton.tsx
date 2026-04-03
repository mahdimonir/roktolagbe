interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={`bg-gray-100 animate-pulse rounded-2xl ${className}`}
    />
  );
}

export function SkeletonCircle({ size = "w-12 h-12" }: { size?: string }) {
  return <Skeleton className={`${size} rounded-full`} />;
}

export function SkeletonText({ lines = 1, className = "" }: { lines?: number, className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-[60%]' : 'w-full'}`} 
        />
      ))}
    </div>
  );
}
