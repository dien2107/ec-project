export default function ProductCardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-80 bg-gray-200 rounded-md mb-2" />
      <div className="h-8 bg-gray-200 rounded w-full mb-1 " />
      <div className="h-4 bg-gray-200 rounded w-full" />
    </div>
  );
}
