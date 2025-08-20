import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import { Check } from "lucide-react";

export default function SuccessDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <AlertDialogTitle className="text-center">
            Đặt hàng thành công!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Cám ơn bạn đã mua hàng tại cửa hàng của chúng tôi. Đơn hàng đang được
            xử lý.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onConfirm} className="w-full bg-black text-white">
            Tiếp tục mua sắm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
