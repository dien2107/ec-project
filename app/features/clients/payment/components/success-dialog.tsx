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
      <AlertDialogContent className="w-[90vw] max-w-[90vw] sm:max-w-sm md:max-w-md lg:max-w-md rounded-lg p-4 sm:p-6 shadow-lg mx-auto overflow-y-auto max-h-[80vh]">
        <AlertDialogHeader>
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 bg-green-100 rounded-full">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
          <AlertDialogTitle className="text-center text-lg sm:text-xl">
            Đặt hàng thành công!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-sm sm:text-base">
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
            Tới trang tài khoản của tôi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
