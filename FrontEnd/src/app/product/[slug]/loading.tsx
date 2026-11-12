export default function Loading() {
  return (
    <div className="container-x pt-6 lg:pt-10" aria-busy="true" aria-label="Loading product">
      <div className="skeleton h-3 w-48" />
      <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="skeleton aspect-square rounded-xl lg:col-span-7" />
        <div className="flex flex-col gap-4 lg:col-span-5">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-12 w-4/5" />
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton mt-6 h-9 w-40" />
          <div className="mt-4 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="skeleton h-11 w-20" />
            ))}
          </div>
          <div className="skeleton mt-4 h-12" />
          <div className="skeleton h-12" />
        </div>
      </div>
    </div>
  );
}
