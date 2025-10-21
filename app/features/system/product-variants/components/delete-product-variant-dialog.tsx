import { useState } from "react";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { deleteProductVariant } from "~/services/product-variants";
import type { ProductVariant } from "~/types/product/product-variant";

export default function DeleteProductVariantDialog({
  open,
  onClose,
  productId,
  variant,
  onDeleted,
}: {
  open: boolean;
  onClose: () => void;
  productId: number;
  variant: ProductVariant;
  onDeleted: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteProductVariant(productId, variant.productVariantId);
      toast.success("Xóa biến thể thành công!");
      onDeleted();
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

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa biến thể sản phẩm</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa biến thể có ID{" "}
            <span className="font-mono font-bold">
              {String(variant.productVariantId).padStart(3, "0")}
            </span>{" "}
            (Size: <span className="font-bold">{variant.size.name}</span>) này?
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#EF4444] text-white flex items-center gap-2"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang xóa...
              </>
            ) : (
              <>Xóa</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
