import SearchBarDropdown from "./search-bar-dropdown";

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
    <SearchBarDropdown
      searchQuery={searchQuery}
      onSearchQueryChange={onSearchQueryChange}
      onSubmit={onSubmit}
      onClear={onClear}
    />
  );
}
