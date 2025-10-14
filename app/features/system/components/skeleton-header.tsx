export default function SkeletonHeader() {
  return (
    <div className="flex items-center justify-between mb-4 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="h-10 w-32 bg-gray-200 rounded"></div>
    </div>
  );
}
