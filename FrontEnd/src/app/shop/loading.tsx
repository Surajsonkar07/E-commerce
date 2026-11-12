import { GridSkeleton } from "@/components/catalogue/grid-skeleton";

export default function Loading() {
  return (
    <div className="container-x pt-6 pb-8 lg:pt-10">
      <div className="skeleton h-3 w-24" />
      <div className="mt-6 mb-8 border-b border-line pb-8">
        <div className="skeleton h-3 w-28" />
        <div className="skeleton mt-3 h-14 w-64" />
      </div>
      <GridSkeleton />
    </div>
  );
}
