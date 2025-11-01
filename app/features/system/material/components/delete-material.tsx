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
import { deleteMaterial } from "~/services/materials";
import type { MaterialDetailDto } from "~/types/product/material";

interface DeleteMaterialDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedMaterial: MaterialDetailDto | null;
  onDelete: () => void;
}

export default function DeleteMaterialDialog({
  open,
  setIsOpen,
  selectedMaterial,
  onDelete,
}: DeleteMaterialDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedMaterial || !selectedMaterial.materialId) {
      toast.error("Vui lòng chọn chất liệu cần xóa!");
      return;
    }

    try {
      setIsLoading(true);
      await deleteMaterial(selectedMaterial.materialId);
      toast.success("Xóa chất liệu thành công!");
      onDelete();
      setIsOpen(false); // ✅ Chỉ đóng dialog khi xóa thành công
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi xóa chất liệu!");
      }
      // ❌ Không đóng dialog ở đây
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedMaterial) return null;

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent className="p-6 rounded-lg shadow-md bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-gray-800">
            Xác nhận xóa chất liệu
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 mt-2">
            Bạn có chắc chắn muốn xóa chất liệu{" "}
            <span className="font-bold text-gray-900">
              {selectedMaterial.name}
            </span>{" "}
            (Mã:{" "}
            <span className="font-mono text-gray-700">
              {selectedMaterial.materialId}
            </span>
            )? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <strong>Cảnh báo:</strong> Việc xóa chất liệu này có thể ảnh hưởng đến
          các sản phẩm đang sử dụng nó. Hãy chắc chắn rằng không có sản phẩm nào
          đang dùng trước khi xóa.
        </div>

        <AlertDialogFooter className="flex justify-between mt-5">
          <AlertDialogCancel
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-700"
          >
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#EF4444] text-white flex items-center gap-2 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
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
