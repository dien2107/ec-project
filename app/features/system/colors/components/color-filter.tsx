import React, { useEffect, useRef, useState } from "react";

type FilterValues = {
  Search?: string; // Use Search as per backend requirements
  StatusName?: string;
};

type Props = {
  initial?: FilterValues;
  onChange: (values: FilterValues) => void;
  statuses: { statusId: number; name: string; displayName: string }[];
  isLoading?: boolean;
};

const ColorFilter: React.FC<Props> = ({
  initial,
  onChange,
  statuses,
  isLoading,
}) => {
  // State for search and status name
  const [search, setSearch] = useState(initial?.Search ?? "");
  const [statusName, setStatusName] = useState<string | undefined>(
    initial?.StatusName
  );

  const lastSentRef = useRef<FilterValues | null>(null);

  useEffect(() => {
    // Sync inputs with initial props
    setSearch(initial?.Search ?? "");
    setStatusName(initial?.StatusName);
    lastSentRef.current = {
      Search: initial?.Search ?? undefined,
      StatusName: initial?.StatusName ?? undefined,
    };
  }, [initial]);

  // Debounce input changes
  useEffect(() => {
    const t = setTimeout(() => {
      const next: FilterValues = {
        Search: search || undefined,
        StatusName: statusName || undefined,
      };

      const prev = lastSentRef.current;
      const changed =
        !prev ||
        prev.Search !== next.Search ||
        prev.StatusName !== next.StatusName;

      if (changed) {
        lastSentRef.current = next;
        onChange(next); // Call onChange with updated values
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search, statusName, onChange]);

  const handleReset = () => {
    setSearch("");
    setStatusName(undefined);
    lastSentRef.current = {};
    onChange({}); // Reset filters
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-60 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-48 h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Tìm theo mã hoặc tên màu..."
        value={search} // Bind input value to state
        onChange={(e) => setSearch(e.target.value)} // Update state on change
        className="border rounded-lg px-3 py-2 text-sm w-60"
      />
      <select
        value={statusName ?? ""}
        onChange={(e) => setStatusName(e.target.value || undefined)}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Tất cả trạng thái</option>
        {statuses.map((s) => (
          <option key={s.statusId} value={s.name ?? s.displayName}>
            {s.displayName ?? s.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleReset}
        className="text-sm text-gray-600 hover:underline px-2 py-1"
      >
        Đặt lại
      </button>
    </div>
  );
};

export default ColorFilter;
