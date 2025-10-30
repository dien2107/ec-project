// ~/features/system/customers/components/customer-filter.tsx

import React, { useEffect, useState, useRef } from "react";
import { useDebounce } from "~/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

type FilterValues = {
  Search?: string;
  Phone?: string;
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

  const debouncedSearch = useDebounce(search, 500);
  const debouncedPhone = useDebounce(phone, 500);

  // So sánh filter cũ để tránh gọi onChange dư
  const prevFiltersRef = useRef<FilterValues | null>(null);

  // Đồng bộ khi initial thay đổi từ ngoài
  useEffect(() => {
    setSearch(initial?.Search ?? "");
    setPhone(initial?.Phone ?? "");
    setStatusName(initial?.StatusName);
  }, [initial]);

  // Gọi onChange chỉ khi có thay đổi
  useEffect(() => {
    const next: FilterValues = {
      Search: debouncedSearch || undefined,
      Phone: debouncedPhone || undefined,
      StatusName: statusName || undefined,
    };

    const prev = prevFiltersRef.current;
    const hasChanged =
      !prev ||
      prev.Search !== next.Search ||
      prev.Phone !== next.Phone ||
      prev.StatusName !== next.StatusName;

    if (hasChanged) {
      prevFiltersRef.current = next;
      onChange(next);
    }
  }, [debouncedSearch, debouncedPhone, statusName, onChange]);

  const handleReset = () => {
    setSearch("");
    setPhone("");
    setStatusName(undefined);
    prevFiltersRef.current = null;
    onChange({});
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4 border rounded-lg bg-gray-50">
        <div className="w-60 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-40 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-48 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-36 h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border rounded-lg bg-gray-50">
      <input
        type="text"
        placeholder="Tìm theo tên/email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm w-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        type="text"
        placeholder="Số điện thoại..."
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

     <Select
        value={statusName ?? undefined}
        onValueChange={(value) => setStatusName(value || undefined)}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Tất cả trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={undefined as any}>Tất cả trạng thái</SelectItem>
          {statuses.map((s) => (
            <SelectItem key={s.statusId} value={s.name}>
              {s.displayName ?? s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        onClick={handleReset}
        className="flex items-center gap-2 text-sm"
      >
        <X className="h-4 w-4" />
        Xóa bộ lọc
      </Button>
    </div>
  );
};

export default CustomerFilter;