import { useState } from "react";
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
import { Button } from "~/components/ui/button";
import type { Address } from "~/types/address/address";
import { toast } from "react-hot-toast";
import { deleteAddress } from "~/services/addresses";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "~/redux/store";

const DeleteAddressDialog = ({
  open,
  setIsOpen,
  selectedAddress,
  onDeleted,
  // optional callback when user cancels the delete dialog (e.g., reopen view-addresses dialog)
  onCancel,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  selectedAddress: Address;
  onDeleted: () => void;
  onCancel?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await deleteAddress(selectedAddress.addressId);
      toast.success("Xóa địa chỉ thành công!");
      onDeleted();
      setIsOpen(false);
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi xóa địa chỉ!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa địa chỉ</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa địa chỉ của{" "}
            <strong>{selectedAddress?.recipientName}</strong> không? Hành động
            này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // if an onCancel handler is provided (opened from view), call it so parent can reopen the view dialog
              if (onCancel) {
                onCancel();
              } else {
                setIsOpen(false);
              }
            }}
          >
            {onCancel ? "Trở về" : "Hủy"}
          </Button>
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
};
export default DeleteAddressDialog;
