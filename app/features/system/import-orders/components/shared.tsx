"use client";
import React from "react";
import { Search, Plus, Trash2, TrendingUp, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
export function SupplierSelect({
  suppliers,
  value,
  onChange,
  isLoading,
  showDate = true,
  orderDate,
  onOrderDateChange,
}: {
  suppliers: any[];
  value: string;
  onChange: (v: string) => void;
  isLoading?: boolean;
  showDate?: boolean;
  orderDate?: string;
  onOrderDateChange?: (v: string) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <PackageIconPlaceholder />
        Thông tin đơn hàng
      </h3>
      <div className={`grid ${showDate ? "grid-cols-2" : "grid-cols-1"} gap-4`}>
        <div>
          <Label>Nhà cung cấp *</Label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn nhà cung cấp" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className="flex justify-center py-2">Đang tải...</div>
              ) : (
                suppliers?.map((s) => (
                  <SelectItem
                    key={s?.supplierId ?? s?.id ?? s?.name}
                    value={s?.supplierId}
                  >
                    {s?.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        {showDate && (
          <div>
            <Label>Ngày đặt hàng</Label>
            <Input
              type="date"
              value={orderDate}
              onChange={(e) => onOrderDateChange?.(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function PackageIconPlaceholder() {
  return <span className="text-blue-600">📦</span>;
}

export function ProductSearchList({
  products,
  searchTerm,
  setSearchTerm,
  isLoading,
  onAdd,
}: {
  products: any[];
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  isLoading?: boolean;
  onAdd: (p: any) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 ">
      <h3 className="font-semibold text-lg mb-4">Chọn sản phẩm nhập</h3>
      <div className="relative mb-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          placeholder="Tìm kiếm sản phẩm theo tên hoặc mã..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg scrollbar-custom">
        {isLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy sản phẩm
          </div>
        ) : (
          <div className="divide-y">
            {products.map((product) => (
              <div
                key={product?.productId ?? product?.id ?? product?.code}
                className="p-3 hover:bg-gray-50 flex items-center justify-between group transition"
              >
                <div className="flex items-center gap-3 flex-1">
                  {product?.primaryImage?.imageUrl || product?.image ? (
                    <img
                      src={product?.primaryImage?.imageUrl ?? product?.image}
                      alt={product?.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      Box
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{product?.name}</div>
                    <div className="text-sm text-gray-500">
                      Mã: {product?.productId ?? product?.code}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => onAdd(product)}
                >
                  <Plus size={16} /> Thêm
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SelectedProductsTable({
  selected,
  onRemove,
  onUpdate,
  onSelect,
}: {
  selected: any[];
  onRemove: (id: any) => void;
  onUpdate: (id: any, field: any, value: number) => void;
  onSelect: (p: any | null) => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-4">
        Sản phẩm đã chọn ({selected.length})
      </h3>
      {selected.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
          Chưa có sản phẩm nào được chọn
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Sản phẩm
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  SL nhập
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Giá nhập
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  % LN
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Giá bán ra
                </th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                  Thành tiền
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {selected.map((product) => (
                <tr
                  key={
                    product.id ??
                    product.productVariantId ??
                    product.productId ??
                    product.code
                  }
                  onClick={() => onSelect(product)}
                  className={`hover:bg-blue-50 cursor-pointer`}
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      {product?.imageUrl ? (
                            <img
                            src={product?.imageUrl }
                            alt={product?.name}
                            className="w-16 h-16 object-cover rounded-md"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                            Box
                            </div>
                        )}
                      <div>
                        <div className="font-medium text-sm">
                          {product.name ?? product.productName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.code ?? product.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      type="number"
                      value={product.importQuantity}
                      onChange={(e) =>
                        onUpdate(
                          product.id ??
                            product.productVariantId ??
                            product.productId,
                          "importQuantity" as any,
                          parseInt(e.target.value) || 0
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      min={1}
                      className="w-20 text-center no-spinner"
                    />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Input
                      type="number"
                      value={product.importPrice}
                      onChange={(e) =>
                        onUpdate(
                          product.id ??
                            product.productVariantId ??
                            product.productId,
                          "importPrice" as any,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      min={0}
                      className="w-28 text-center no-spinner"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <Input
                      type="number"
                      value={product.profitMargin}
                      onChange={(e) =>
                        onUpdate(
                          product.id ??
                            product.productVariantId ??
                            product.productId,
                          "profitMargin" as any,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      onClick={(e) => e.stopPropagation()}
                      min={0}
                      max={1000}
                      className="w-16 text-center no-spinner"
                    />
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-green-600">
                    {Math.round(product.suggestedPrice).toLocaleString("vi-VN")}
                    đ
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-blue-600">
                    {Math.round(product.totalPrice).toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:bg-red-50"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onRemove(
                          product.id ??
                            product.productVariantId ??
                            product.productId
                        );
                      }}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export function SummaryPanel({
  selected,
  totals,
}: {
  selected: any[];
  totals: { quantity: number; amount: number };
}) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
      <h3 className="font-semibold text-lg mb-4 text-blue-900 flex items-center gap-2">
        <TrendingUp size={20} />
        Tổng quan đơn hàng
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-blue-200">
          <span className="text-gray-700">Tổng sản phẩm:</span>
          <span className="font-bold text-lg text-blue-900">
            {selected.length}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-blue-200">
          <span className="text-gray-700">Tổng số lượng:</span>
          <span className="font-bold text-lg text-blue-900">
            {totals.quantity}
          </span>
        </div>
        <div className="flex justify-between items-center py-3 bg-white rounded-lg px-3 mt-4">
          <span className="text-gray-700 font-medium">Tổng tiền:</span>
          <span className="font-bold text-2xl text-blue-600">
            {Math.round(totals.amount).toLocaleString("vi-VN")}đ
          </span>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailPanel({
  item,
  onClose,
}: {
  item: any | null;
  onClose: () => void;
}) {
  if (!item) return null;
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-gray-900">
          Chi tiết sản phẩm
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </Button>
      </div>
      <div className="space-y-3">
        <div className="text-center py-4 bg-gray-50 rounded-lg flex justify-center">
          {item?.imageUrl ? (
            <img
              src={item?.imageUrl }
              alt={item?.name}
              className="w-16 h-16 object-cover rounded-md"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
              Box
            </div>
          )}
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Tên sản phẩm:</span>
            <span className="font-medium text-right">
              {item.name ?? item.productName}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Mã sản phẩm:</span>
            <span className="font-medium">{item.code ?? item.sku}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Danh mục:</span>
            <span className="font-medium">{item.category}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Tồn kho hiện tại:</span>
            <span className="font-medium text-orange-600">
              {item.currentStock}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Giá bán:</span>
            <span className="font-medium text-blue-600">
              {(item.price ?? 0).toLocaleString("vi-VN")}đ
            </span>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg mt-4">
            <div className="text-xs text-gray-600 mb-1">
              Thông tin nhập hàng
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Số lượng nhập:</span>
              <span className="font-bold">{item.importQuantity}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Giá nhập:</span>
              <span className="font-bold">
                {Math.round(item.importPrice ?? 0).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>% Lợi nhuận:</span>
              <span className="font-bold text-green-600">
                {item.profitMargin}%
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>Giá bán đề xuất:</span>
              <span className="font-medium text-orange-600">
                {Math.round(item.suggestedPrice ?? 0).toLocaleString("vi-VN")}đ
              </span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-blue-200 mt-2">
              <span>Thành tiền nhập:</span>
              <span className="font-bold text-lg text-blue-600">
                {Math.round(item.totalPrice ?? 0).toLocaleString("vi-VN")}đ
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
