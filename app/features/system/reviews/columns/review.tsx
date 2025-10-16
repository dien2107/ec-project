import type { ColumnDef } from "@tanstack/react-table";
import { Star, StarHalf, Eye, EyeClosed } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SortableHeader } from "../../components/data-table";

import type { Review } from "../types/review";

const renderStars = (rating: number) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star size={16} key={i} fill="gold" stroke="gold" />);
    } else if (rating + 0.5 >= i) {
      stars.push(<StarHalf size={16} key={i} fill="gold" stroke="gold" />);
    } else {
      stars.push(<Star size={16} key={i} stroke="gold" />);
    }
  }

  return stars;
};

export const getColumns = (
  selectedReview: Review | null,
  setSelectedReview: (review: Review) => void
): ColumnDef<Review>[] => [
  {
    accessorKey: "review_id",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="ID"
          className="justify-start w-[40px]"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="font-mono font-bold">
          REV{String(row.original.reviewId).padStart(3, "0")}
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Username"
          className="justify-start"
        />
      );
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Đánh giá"
          className="justify-start"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          {renderStars(row.original.rating)}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Ngày đánh giá"
          className="justify-start"
        />
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="text-gray-400">{date.toLocaleDateString("en-GB")}</div>
      );
    },
  },
  {
    accessorKey: "helpful_count",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Hữu ích"
          className="justify-start"
        />
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Trạng thái"
          className="justify-start"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className="inline-block w-[80px] text-left">
          {row.original.status.name === "Approved" ? (
            <div className="bg-green-400 text-white py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Hiển thị
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-400 py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Ẩn
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => (
      <div className="flex justify-end px-4">Thao tác</div>
    ),
    cell: ({ row }) => {
      const isSelected = selectedReview?.reviewId === row.original.reviewId;

      return (
        <div className="flex justify-end">
          <Button
            variant={isSelected ? "secondary" : "outline"}
            onClick={() => setSelectedReview(row.original)}
            disabled={isSelected}
          >
            {isSelected ? <EyeClosed /> : <Eye />}
          </Button>
        </div>
      );
    },
  },
];
