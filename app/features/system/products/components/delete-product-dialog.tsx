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
import { deleteProduct } from "~/services/products";
import type { Product } from "../types/product";

export default function DeleteProductDialog({
  open,
  setIsOpen,
  selectedProduct,
  onDeleted,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedProduct: Product;
  onDeleted: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteProduct(selectedProduct.productId);
      toast.success("Xóa sản phẩm thành công!");
      onDeleted();
      setIsOpen(false);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi xóa sản phẩm!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa sản phẩm có ID{" "}
            <span className="font-mono font-bold">
              PRO
              {String(selectedProduct.productId).padStart(3, "0")}
            </span>{" "}
            này? Hành động này không thể hoàn tác.
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
