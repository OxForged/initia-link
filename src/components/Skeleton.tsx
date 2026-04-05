export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} />;
}

export function ProfileCardSkeleton() {
  return (
    <div className="bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-3 mb-3">
        <div className="skeleton w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="skeleton h-4 w-28 mb-2" />
          <div className="skeleton h-3 w-16" />
        </div>
      </div>
      <div className="skeleton h-3 w-full mb-1.5" />
      <div className="skeleton h-3 w-2/3" />
      <div className="flex gap-4 mt-3">
        <div className="skeleton h-3 w-14" />
        <div className="skeleton h-3 w-20" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="skeleton h-7 w-32 mb-2" />
      <div className="skeleton h-4 w-24 mb-6" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-2xl p-4 bg-[var(--surface)]">
            <div className="skeleton h-7 w-12 mx-auto mb-2 rounded" />
            <div className="skeleton h-3 w-16 mx-auto rounded" />
          </div>
        ))}
      </div>
      <div className="flex gap-4 mb-8">
        <div className="skeleton h-10 w-28 rounded-xl" />
        <div className="skeleton h-10 w-28 rounded-xl" />
      </div>
      <div className="skeleton h-5 w-36 mb-3" />
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="max-w-sm mx-auto text-center py-8 animate-fade-in">
      <div className="skeleton w-24 h-24 rounded-full mx-auto mb-4" />
      <div className="skeleton h-7 w-40 mx-auto mb-2" />
      <div className="flex justify-center gap-4 mb-4">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-4 w-20" />
      </div>
      <div className="skeleton h-4 w-3/4 mx-auto mb-6" />
      <div className="flex flex-col gap-3 mb-6">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-12 w-full rounded-xl" />
        ))}
      </div>
      <div className="flex justify-center gap-3">
        <div className="skeleton h-10 w-24 rounded-xl" />
        <div className="skeleton h-10 w-24 rounded-xl" />
      </div>
    </div>
  );
}
