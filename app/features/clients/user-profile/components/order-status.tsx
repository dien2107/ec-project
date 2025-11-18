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
    // Mobile/tablet: horizontal scroll with wrap; Desktop (lg+) preserves original border-bottom pills layout.
    <div className="w-full">
      <div className="overflow-x-auto scrollbar-custom pb-2 sm:pb-0 -mx-4 px-4 lg:-mx-0 lg:px-0 border-b mb-6">
        {/* allow wrap on small screens, keep no-wrap + snap on sm+ */}
        <div className="flex items-center gap-3 lg:gap-8 flex-wrap sm:flex-nowrap sm:snap-x sm:snap-mandatory">
          {statusTabs.map((s) => (
            <Button
              key={s}
              onClick={() => onChange(s)}
              className={`flex-shrink-0 sm:snap-start whitespace-nowrap text-sm font-medium transition-colors
                px-3 py-2 rounded-full lg:rounded-none lg:px-1 lg:pb-4 lg:border-b-2
                ${
                  currentStatus === s
                    ? "bg-blue-50 text-blue-600 lg:bg-transparent lg:border-blue-600"
                    : "bg-transparent text-gray-500 hover:text-gray-700 lg:border-transparent"
                }`}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>
      <style>{`.scrollbar-custom{-ms-overflow-style:none;scrollbar-width:none}.scrollbar-custom::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
