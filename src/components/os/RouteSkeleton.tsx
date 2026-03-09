import { Skeleton } from "@/components/ui/skeleton";

export function RouteSkeleton() {
  return (
    <div className="space-y-6">
      <div className="surface-panel rounded-[28px] p-6">
        <Skeleton className="h-4 w-40 bg-secondary" />
        <Skeleton className="mt-4 h-12 w-80 max-w-full bg-secondary" />
        <Skeleton className="mt-4 h-4 w-full max-w-[42rem] bg-secondary" />
        <Skeleton className="mt-2 h-4 w-full max-w-[36rem] bg-secondary" />
        <div className="mt-6 flex flex-wrap gap-3">
          <Skeleton className="h-10 w-40 rounded-full bg-secondary" />
          <Skeleton className="h-10 w-44 rounded-full bg-secondary" />
          <Skeleton className="h-10 w-36 rounded-full bg-secondary" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="surface-soft rounded-[24px] p-5">
            <Skeleton className="h-3 w-24 bg-secondary" />
            <Skeleton className="mt-5 h-9 w-20 bg-secondary" />
            <Skeleton className="mt-5 h-3 w-full bg-secondary" />
            <Skeleton className="mt-2 h-3 w-3/4 bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
}
