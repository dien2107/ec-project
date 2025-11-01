import { Input } from "~/components/ui/input";

interface SearchResultHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
}

export default function SearchResultHeader({
  searchQuery,
  onSearchQueryChange,
  onSubmit,
  onClear,
}: SearchResultHeaderProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 pb-2">
      <h1 className="text-3xl font-normal text-center mb-8 text-gray-800">
        Kết quả tìm kiếm
      </h1>

      <div className="max-w-4xl mx-auto mb-12">
        <form onSubmit={onSubmit} className="relative">
          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full h-12 px-6 text-base border border-gray-300 rounded focus:outline-none focus:border-gray-400 hover:border-gray-400 transition-colors pr-24"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClear}
              className="absolute cursor-pointer right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Xóa tìm kiếm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <button
            type="submit"
            className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
            aria-label="Tìm kiếm"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
