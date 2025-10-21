import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { fetchSizeOptions } from "~/redux/slices/sizes-options";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import type { ProductVariant } from "~/types/product/product-variant";
import type { Size } from "~/types/product/size";
import { addProductVariant } from "~/services/product-variants";

export default function AddProductVariantDialog({
  open,
  productId,
  onClose,
  onAdded,
  variants,
}: {
  open: boolean;
  productId: number;
  onClose: () => void;
  onAdded: (sizeId: number) => void;
  variants: ProductVariant[];
}) {
  const dispatch = useAppDispatch();
  const { sizeOptions } = useAppSelector((state) => state.sizeOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [sizeId, setSizeId] = useState<number | null>(null);

  useEffect(() => {
    if (!sizeOptions || sizeOptions.length === 0) {
      dispatch(fetchSizeOptions());
    }
  }, [dispatch, sizeOptions]);

  const handleAdd = async () => {
    if (!sizeId) {
      toast.error("Vui lòng chọn size!");
      return;
    }
    try {
      setIsLoading(true);
      await addProductVariant(productId, sizeId);
      toast.success("Thêm biến thể thành công!");
      onAdded(sizeId);
      onClose();
    } catch (error: any) {
      toast.error("Có lỗi xảy ra khi thêm biến thể!");
    } finally {
      setIsLoading(false);
    }
  };

  const usedSizeIds = variants.map((v) => v.size.sizeId);
  const availableSizes = sizeOptions.filter(
    (size) => !usedSizeIds.includes(size.sizeId)
  );

  return (
    <Dialog open={open && availableSizes.length > 0} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm biến thể sản phẩm</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <Select
              value={sizeId?.toString() || ""}
              onValueChange={(value) => setSizeId(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn size" />
              </SelectTrigger>
              <SelectContent>
                {availableSizes.map((opt: Size) => (
                  <SelectItem key={opt.sizeId} value={opt.sizeId.toString()}>
                    {opt.name}
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
            type="button"
            className="bg-[#3770EC] text-white flex items-center gap-2"
            disabled={isLoading}
            onClick={handleAdd}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang thêm...
              </>
            ) : (
              <>
                <Plus size={18} />
                Thêm biến thể
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
