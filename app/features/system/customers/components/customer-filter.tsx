import React, { useEffect, useRef, useState } from "react";
type FilterValues = {
  Search?: string;
  Phone?: string;
  HasRole?: boolean;
  StatusName?: string | undefined;
};

type Props = {
  initial?: FilterValues;
  onChange: (values: FilterValues) => void;
  statuses: { statusId: number; name: string; displayName: string }[];
  isLoading?: boolean;
};

const CustomerFilter: React.FC<Props> = ({
  initial,
  onChange,
  statuses,
  isLoading,
}) => {
  const [search, setSearch] = useState(initial?.Search ?? "");
  const [phone, setPhone] = useState(initial?.Phone ?? "");
  const [statusName, setStatusName] = useState<string | undefined>(
    initial?.StatusName
  );

  // keep last sent values to avoid duplicate fetches
  const lastSentRef = useRef<FilterValues | null>(null);

  // sync local state when `initial` changes (but treat as already-sent so no extra fetch)
  useEffect(() => {
    setSearch(initial?.Search ?? "");
    setPhone(initial?.Phone ?? "");
    setStatusName(initial?.StatusName);
    lastSentRef.current = {
      Search: initial?.Search ?? undefined,
      Phone: initial?.Phone ?? undefined,
      HasRole: initial?.HasRole ?? undefined,
      StatusName: initial?.StatusName ?? undefined,
    };
  }, [initial]);

  // debounce + only call onChange when values actually changed
  useEffect(() => {
    const t = setTimeout(() => {
      const next: FilterValues = {
        Search: search || undefined,
        Phone: phone || undefined,
        StatusName: statusName || undefined,
      };

      const prev = lastSentRef.current;
      const changed =
        !prev ||
        prev.Search !== next.Search ||
        prev.Phone !== next.Phone ||
        prev.HasRole !== next.HasRole ||
        prev.StatusName !== next.StatusName;

      if (changed) {
        lastSentRef.current = next;
        onChange(next);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search, phone, statusName, onChange]);

  const handleReset = () => {
    setSearch("");
    setPhone("");
    setStatusName(undefined);
    lastSentRef.current = {};
    onChange({});
  };

  if (isLoading) {
    // skeleton filter placeholder (match supplier style)
    return (
      <div className="flex items-center gap-3">
        <div className="w-60 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-40 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-48 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-36 h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Tìm theo tên/email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm w-60"
      />
      <input
        type="text"
        placeholder="Số điện thoại..."
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm w-40"
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

export default CustomerFilter;
