import { Button } from "~/components/ui/button";
import type { OrderStatus } from "~/features/clients/user-profile/types/user";

type StatusType = "Tất cả" | OrderStatus;

export default function OrderStatusTabs({
  currentStatus,
  onChange,
}: {
  currentStatus: StatusType;
  onChange: (s: StatusType) => void;
}) {
  const statusTabs: StatusType[] = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang xử lý",
    "Đang giao",
    "Đã giao",
    "Đã hủy",
  ];

  return (
    <div className="flex space-x-8 overflow-x-auto border-b mb-6">
      {statusTabs.map(s => (
        <Button
          key={s}
          onClick={() => onChange(s)}
          className={`pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
            currentStatus === s
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {s}
        </Button>
      ))}
    </div>
  );
}
