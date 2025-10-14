import type { ColumnDef } from "@tanstack/react-table";
import { ChevronUp, SquarePen, Trash, MessageSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SortableHeader } from "../../components/data-table";
import type { Product } from "../types/product";

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export const getColumns = (
  handleEdit: (product: Product) => void,
  handleDelete: (product: Product) => void,
  handleReview: (product: Product) => void
): ColumnDef<Product>[] => [
  {
    id: "expander",
    header: "",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="w-2"
          onClick={() => row.toggleExpanded()}
        >
          {row.getIsExpanded() ? (
            <ChevronUp className="h-4 w-4 transition-transform duration-200" />
          ) : (
            <ChevronUp className="h-4 w-4 rotate-180 transition-transform duration-200" />
          )}
        </Button>
      );
    },
    sticky: true,
  },
  {
    accessorKey: "productId",
    header: ({ column }) => {
      return <SortableHeader column={column} title="ID" className="w-[80px]" />;
    },
    cell: ({ row }) => {
      const id = row.original.productId;
      const paddedId = String(id).padStart(3, "0");
      return <span className="font-mono font-bold ">PRO{paddedId}</span>;
    },
    sticky: true,
  },
  {
    accessorKey: "primaryImage",
    header: ({ column }) => (
      <div className="text-center font-medium w-full">Ảnh</div>
    ),
    cell: ({ row }) => {
      const imageUrl = row.original.primaryImage?.imageUrl;
      return (
        <div className="flex justify-center items-center w-[80px] h-[80px]">
          <img
            src={imageUrl}
            alt="Ảnh sản phẩm"
            className="object-cover rounded-md w-14 h-14 border"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} title="Tên" className="justify-start" />
      );
    },
    cell: ({ row }) => {
      const MAX_LENGTH = 30;
      const name = row.original.name;
      const slug = row.original.slug;
      const shortName =
        name.length > MAX_LENGTH ? name.slice(0, MAX_LENGTH) + "..." : name;
      const shortSlug =
        slug.length > MAX_LENGTH ? slug.slice(0, MAX_LENGTH) + "..." : slug;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{shortName}</span>
          <span className="text-xs text-gray-400">{shortSlug}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "basePrice",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} className="w-[80px]">
          <div className="flex flex-col items-start ">
            <span>Giá</span>
            <span>cơ bản</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right">{formatVND(row.original.basePrice)}</div>
      );
    },
  },
  {
    accessorKey: "sellingPrice",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} className="w-[80px]">
          <div className="flex flex-col items-start ">
            <span>Giá</span>
            <span>bán</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.discountPercentage > 0 ? (
            <div className="flex flex-col">
              <div className="text-right font-medium">
                {formatVND(row.original.sellingPrice)}
              </div>
              <div className="text-right line-through text-gray-400">
                {formatVND(row.original.basePrice)}
              </div>
            </div>
          ) : (
            <div className="text-right font-medium">
              {formatVND(row.original.sellingPrice)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "discountPercentage",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} className="w-[80px]">
          <div className="flex flex-col items-start ">
            <span>Giảm</span>
            <span>giá %</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex m-auto">
          {row.original.discountPercentage > 0 ? (
            <div className="inline-block mx-auto min-w-12 py-1 px-2 bg-[#EF4444] rounded-lg text-white text-center">
              {row.original.discountPercentage}%
            </div>
          ) : (
            <div className="inline-block mx-auto min-w-12 py-1 px-2 bg-gray-200 rounded-lg text-gray-400 text-center">
              0%
            </div>
          )}
        </div>
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
          className="w-[100px]"
        />
      );
    },
    cell: ({ row }) => {
      const statusName = row.original.status.name;
      return (
        <div className="w-[100px] text-center">
          {statusName === "Active" && (
            <div className="bg-green-400 text-white py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Hoạt động
            </div>
          )}
          {statusName === "Inactive" && (
            <div className="bg-red-200 text-white py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Không hoạt động
            </div>
          )}
          {statusName === "Draft" && (
            <div className="bg-gray-200 text-gray-400 py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Nháp
            </div>
          )}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      if (!value) return true;
      if (value === "all") return true;
      const rowValue = row.getValue(id) ? "active" : "inactive";
      return rowValue === value;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} title="Ngày tạo" className="w-[80px]">
          <div className="flex flex-col items-start">
            <span>Ngày</span>
            <span>tạo</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.original.createdAt;
      const dateObj = new Date(dateStr);
      return (
        <div className="text-center text-gray-400">
          {dateObj.toLocaleDateString("en-GB")}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <SortableHeader
          column={column}
          title="Ngày cập nhật"
          className="w-[80px]"
        >
          <div className="flex flex-col items-start">
            <span>Ngày</span>
            <span>cập nhật</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ row }) => {
      const dateStr = row.original.updatedAt;
      const dateObj = new Date(dateStr);
      return (
        <div className="text-center text-gray-400">
          {dateObj.toLocaleDateString("en-GB")}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      return <div className="flex justify-end px-4">Thao tác</div>;
    },
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleReview(product)}
          >
            <MessageSquare />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(product)}
          >
            <SquarePen />
          </Button>

          {product.status.name == "Draft" && (
            <Button
              variant="ghost"
              color="destructive"
              size="icon"
              onClick={() => handleDelete(product)}
            >
              <Trash stroke="red" />
            </Button>
          )}
        </div>
      );
    },
  },
];
