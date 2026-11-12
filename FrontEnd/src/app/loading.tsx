export default function Loading() {
  return (
    <div className="container-x pt-8 lg:pt-12" aria-busy="true" aria-label="Loading">
      <div className="skeleton h-3 w-32" />
      <div className="skeleton mt-4 h-12 w-2/3 max-w-xl" />
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="skeleton aspect-[4/5] rounded-lg" />
            <div className="skeleton mt-3 h-4 w-4/5" />
            <div className="skeleton mt-2 h-4 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
