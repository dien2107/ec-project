import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import { CheckCircle } from "lucide-react";

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
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Đặt hàng thành công!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Cám ơn bạn đã mua hàng tại cửa hàng của chúng tôi. Đơn hàng đang
            được xử lý.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={onConfirm}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            Tiếp tục mua sắm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
