import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "~/components/ui/select";
import type { ProductVariant } from "~/types/product/product-variant";
import type { UpdateProductVariant } from "../types/update-product-variant";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { ENTITY_TYPE } from "~/constants/entity-types";
import { fetchSizeOptions } from "~/redux/slices/sizes-options";
import { updateProductVariant } from "~/services/product-variants";
import { fetchStatuses } from "~/redux/slices/statuses";

export default function EditProductVariantDialog({
  open,
  onClose,
  variant,
  onUpdated,
  variants,
}: {
  open: boolean;
  onClose: () => void;
  variant: ProductVariant;
  onUpdated: () => void;
  variants: ProductVariant[];
}) {
  const dispatch = useAppDispatch();
  const statuses = useAppSelector(
    (state) => state.statuses.data?.[ENTITY_TYPE.SHIP] ?? []
  );
  const { sizeOptions } = useAppSelector((state) => state.sizeOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<UpdateProductVariant>({
    statusId: variant.status.statusId,
    sizeId: variant.size.sizeId,
  });

  useEffect(() => {
    if (!sizeOptions || sizeOptions.length === 0) {
      dispatch(fetchSizeOptions());
    }
  }, [dispatch, sizeOptions]);

  useEffect(() => {
    dispatch(fetchStatuses({ entityType: ENTITY_TYPE.SHIP }));
  }, [dispatch]);

  useEffect(() => {
    if (open && variant) {
      setForm({
        statusId: variant.status.statusId,
        sizeId: variant.size.sizeId,
      });
    }
  }, [open, variant]);

  const handleSizeChange = (value: string) => {
    setForm((prev) => ({ ...prev, sizeId: Number(value) }));
  };

  const handleStatusChange = (value: string) => {
    setForm((prev) => ({ ...prev, statusId: Number(value) }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateProductVariant(
        variant.productId,
        variant.productVariantId,
        form
      );
      toast.success("Cập nhật biến thể sản phẩm thành công!");
      onUpdated();
      onClose();
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi xóa biến thể sản phẩm!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const usedSizeIds = variants
    .filter((v) => v.productVariantId !== variant.productVariantId)
    .map((v) => v.size.sizeId);
  const availableSizes = sizeOptions.filter(
    (size) => !usedSizeIds.includes(size.sizeId)
  );

  return (
    <Dialog
      open={open && statuses.length > 0 && availableSizes.length > 0}
      onOpenChange={onClose}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa biến thể</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                ID biến thể
              </label>
              <Input
                value={String(variant.productVariantId).padStart(3, "0")}
                disabled
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tồn kho</label>
              <Input value={variant.stockQuantity} disabled readOnly />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <Input value={variant.sku} disabled readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <Select
              value={form.sizeId?.toString() || ""}
              onValueChange={handleSizeChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn size" />
              </SelectTrigger>
              <SelectContent>
                {availableSizes.map((opt) => (
                  <SelectItem key={opt.sizeId} value={opt.sizeId.toString()}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <Select
              value={form.statusId?.toString() || ""}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((opt) => (
                  <SelectItem
                    key={opt.statusId}
                    value={opt.statusId.toString()}
                  >
                    {opt.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          {!isLoading && (
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
          )}
          <Button
            type="submit"
            className="bg-[#3770EC] text-white cursor-pointer flex items-center gap-2"
            disabled={isLoading}
            onClick={handleSave}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang lưu...
              </>
            ) : (
              <>
                <Save size={18} />
                Lưu thay đổi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
