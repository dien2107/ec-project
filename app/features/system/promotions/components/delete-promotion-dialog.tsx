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
import { deleteDiscount } from "~/services/discounts";
import type { DiscountDetailDto } from "~/types/discounts";

interface DeletePromotionDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedPromotion: DiscountDetailDto | null;
  onDelete: () => void;
  currentPage?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export default function DeletePromotionDialog({
  open,
  setIsOpen,
  selectedPromotion,
  onDelete,
  currentPage = 1,
  totalItems = 0,
  pageSize = 6,
  onPageChange,
}: DeletePromotionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedPromotion || !selectedPromotion.discountId) {
      toast.error("Vui lòng chọn mã khuyến mãi cần xóa!");
      return;
    }

    try {
      setIsLoading(true);

      // 🔹 Bước 1: Gọi API xóa
      await deleteDiscount(selectedPromotion.discountId);

      // 🔹 Bước 2: Logic kiểm tra và chuyển trang
      const itemsInCurrentPage = totalItems - (currentPage - 1) * pageSize;
      const isLastItemInPage = itemsInCurrentPage === 1;
      const hasMultiplePages = currentPage > 1;

      // Nếu đang ở trang cuối và xóa item cuối cùng, quay về trang trước
      if (isLastItemInPage && hasMultiplePages && onPageChange) {
        onPageChange(currentPage - 1);
      }

      // 🔹 Bước 3: Reload list (đợi hoàn thành)
      await onDelete();

      // 🔹 Bước 4: Đóng dialog
      setIsOpen(false);

      // 🔹 Bước 5: Hiển thị toast (sau khi đóng dialog)
      toast.success("Xóa mã khuyến mãi thành công!");
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi xóa mã khuyến mãi!");
      }
      // ❌ Không đóng dialog ở đây
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPromotion) return null;

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent className="p-6 rounded-lg shadow-md bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-800">
            Xác nhận xóa mã khuyến mãi
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 mt-2">
            Bạn có chắc chắn muốn xóa mã khuyến mãi{" "}
            <span className="font-semibold text-gray-900">
              {selectedPromotion.code}
            </span>{" "}
            (Mã:{" "}
            <span className="font-mono text-gray-500">
              {selectedPromotion.discountId}
            </span>
            )? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Cảnh báo:</strong> Việc xóa mã khuyến mãi này có thể ảnh hưởng
          đến các đơn hàng đã sử dụng mã này. Hãy chắc chắn rằng không còn đơn
          hàng nào đang áp dụng trước khi xóa.
        </div>

        <AlertDialogFooter className="flex justify-between mt-4">
          <AlertDialogCancel
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-[#EF4444] text-white flex items-center gap-2 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang xóa...
              </>
            ) : (
              <>Xóa mã khuyến mãi</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
