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
import { deleteCategory } from "~/services/categories"; // ⚡ Import API service
import type { CategoryDetailDto } from "~/types/product/category";

interface DeleteCategoryDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedCategory: CategoryDetailDto;
  onDelete: () => void; // callback reload list sau khi xóa
}

export default function DeleteCategoryDialog({
  open,
  setIsOpen,
  selectedCategory,
  onDelete,
}: DeleteCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteCategory(selectedCategory.categoryId); // ⚡ Gọi API xóa
      toast.success("Xóa danh mục thành công!");
      onDelete(); // Reload list
      setIsOpen(false);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi xóa danh mục!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent className="p-6 rounded-lg shadow-md bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-800">
            Xác nhận xóa danh mục
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 mt-2">
            Bạn có chắc chắn muốn xóa danh mục{" "}
            <span className="font-semibold text-gray-900">
              {selectedCategory.name}
            </span>{" "}
            (Mã danh mục:{" "}
            <span className="font-mono text-gray-500">
              {selectedCategory.categoryId}
            </span>
            )? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Cảnh báo:</strong> Việc xóa thể loại này có thể ảnh hưởng đến
          các sản phẩm đang sử dụng nó Hoặc ảnh hưởng đến các thể loại con. Hãy
          chắc chắn rằng không có sản phẩm nào đang dùng trước khi xóa.
        </div>

        <AlertDialogFooter className="flex justify-between mt-4">
          <AlertDialogCancel className="text-gray-500 hover:text-gray-700">
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
              <>Xóa danh mục</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
