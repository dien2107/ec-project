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
import { deleteColor } from "~/services/colors";
import type { ColorDetailDto } from "../../../../types/product/color";

interface DeleteColorDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedColor: ColorDetailDto;
  onDelete: () => void; // ✅ Đổi từ onDeleted thành onDelete
}

export default function DeleteColorDialog({
  open,
  setIsOpen,
  selectedColor,
  onDelete, // ✅ Đổi từ onDeleted thành onDelete
}: DeleteColorDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteColor(selectedColor.colorId);
      toast.success("Xóa màu sắc thành công!");
      onDelete(); // ✅ Gọi prop onDelete
      setIsOpen(false);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi xóa màu sắc!");
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
            Xác nhận xóa màu sắc
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600 mt-2">
            Bạn có chắc chắn muốn xóa màu{" "}
            <span className="font-mono font-bold text-gray-900">
              {selectedColor.displayName}
            </span>{" "}
            (Mã màu:{" "}
            <span className="font-mono font-bold text-gray-500">
              {selectedColor.hexCode}
            </span>
            )? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-between mt-4">
          <AlertDialogCancel className="text-gray-500 hover:text-gray-700">
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
