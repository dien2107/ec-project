export default function SkeletonFilter() {
  return (
    <div className="flex gap-3 py-3 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-gray-200 rounded-md flex-1"></div>
      ))}
      <div className="h-10 w-20 bg-gray-200 rounded-md"></div>
    </div>
  );
}
