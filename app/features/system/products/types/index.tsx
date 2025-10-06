import type { ColumnDef } from "@tanstack/react-table";
import { ChevronUp, SquarePen, Trash, MessageSquare } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SortableHeader } from "../../components/data-table";

export type ProductVariant = {
  product_variant_id: number;
  color_id: number;
  color_name: string;
  code_hex: string;
  size_id: number;
  size_name: string;
  stock_quantity: number;
};

export type ProductImages = {
  product_image_id: number;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
};

export type ReviewImages = {
  review_image_id: number;
  image_url: string;
};

export type Review = {
  review_id: number;
  username: string;
  rating: number;
  content: string;
  status: string;
  helpful_count: number;
  created_at: Date;
  updated_at: Date;
  images: ReviewImages[];
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  material_id: number;
  category_id: number;
  base_price: number;
  sale_price: number;
  discount_percent: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  product_variant: ProductVariant[];
  images: ProductImages[];
  reviews: Review[];
};

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
  },
  {
    accessorKey: "images",
    header: ({ column }) => {
      return <div className="text-start">Ảnh</div>;
    },
    cell: ({ row }) => {
      const images = row.original.images;
      const primaryImage = images.find(img => img.is_primary);
      return (
        <div className="aspect-ratio[9/16] w-12">
          <img
            src={primaryImage?.image_url}
            alt={primaryImage?.alt_text}
            className="w-full h-full object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <SortableHeader column={column} title="ID" className="w-[40px]" />;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} title="Tên" className="justify-start" />
      );
    },
    meta: {
      filterConfig: {
        type: "text",
        placeholder: "Tìm tên sản phẩm...",
      },
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-xs text-gray-400">{row.original.slug}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "base_price",
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
        <div className="text-right">{formatVND(row.original.base_price)}</div>
      );
    },
  },
  {
    accessorKey: "sale_price",
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
          {row.original.discount_percent > 0 ? (
            <div className="flex flex-col">
              <div className="text-right font-medium">
                {formatVND(row.original.sale_price)}
              </div>
              <div className="text-right line-through text-gray-400">
                {formatVND(row.original.base_price)}
              </div>
            </div>
          ) : (
            <div className="text-right font-medium">
              {formatVND(row.original.sale_price)}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "discount_percent",
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
          {row.original.discount_percent > 0 ? (
            <div className="inline-block mx-auto min-w-12 py-1 px-2 bg-[#EF4444] rounded-lg text-white text-center">
              {row.original.discount_percent}%
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
    meta: {
      filterConfig: {
        type: "select",
        placeholder: "Trạng thái",
        options: [
          { value: "all", label: "Tất cả" },
          { value: "active", label: "Hoạt động" },
          { value: "inactive", label: "Không hoạt động" },
        ],
      },
    },
    cell: ({ row }) => {
      return (
        <div className="w-[100px] text-center">
          {row.original.status ? (
            <div className="bg-green-400 text-white py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Hoạt động
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-400 py-1 px-2 rounded-lg text-center whitespace-normal break-words">
              Không hoạt động
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
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <SortableHeader column={column} title="Giá bán" className="w-[80px]">
          <div className="flex flex-col items-start">
            <span>Ngày</span>
            <span>tạo</span>
          </div>
        </SortableHeader>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-center text-gray-400">
          {row.original.created_at.toLocaleDateString("en-GB")}
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
          <Button
            variant="ghost"
            color="destructive"
            size="icon"
            onClick={() => handleDelete(product)}
          >
            <Trash stroke="red" />
          </Button>
        </div>
      );
    },
  },
];
