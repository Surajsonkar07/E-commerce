export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="lg:grid lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-12" aria-busy="true" aria-label="Loading products">
      <div className="hidden flex-col gap-3 lg:flex">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="skeleton h-6" style={{ width: `${60 + ((i * 17) % 35)}%` }} />
        ))}
      </div>
      <div>
        <div className="flex justify-between">
          <div className="skeleton h-11 w-28" />
          <div className="skeleton h-11 w-48" />
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: count }, (_, i) => (
            <div key={i}>
              <div className="skeleton aspect-[4/5] rounded-lg" />
              <div className="skeleton mt-3 h-3 w-1/3" />
              <div className="skeleton mt-2 h-4 w-4/5" />
              <div className="skeleton mt-2 h-4 w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
