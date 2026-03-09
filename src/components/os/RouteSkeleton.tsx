import { Skeleton } from "@/components/ui/skeleton";

export function RouteSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-white/8 bg-white/[0.03] p-6">
        <Skeleton className="h-4 w-40 bg-white/10" />
        <Skeleton className="mt-4 h-12 w-80 max-w-full bg-white/10" />
        <Skeleton className="mt-4 h-4 w-full max-w-[42rem] bg-white/10" />
        <Skeleton className="mt-2 h-4 w-full max-w-[36rem] bg-white/10" />
        <div className="mt-6 flex flex-wrap gap-3">
          <Skeleton className="h-11 w-40 rounded-full bg-white/10" />
          <Skeleton className="h-11 w-44 rounded-full bg-white/10" />
          <Skeleton className="h-11 w-36 rounded-full bg-white/10" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
            <Skeleton className="h-3 w-24 bg-white/10" />
            <Skeleton className="mt-5 h-9 w-20 bg-white/10" />
            <Skeleton className="mt-5 h-3 w-full bg-white/10" />
            <Skeleton className="mt-2 h-3 w-3/4 bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
