import { useNavigate, useLocation } from "react-router";
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { clearCartAsync } from "~/redux/slices/cartSlice";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector(state => state.auth.user);
  const userId = authUser?.data?.userId;

  // Lấy dữ liệu từ navigate("/payment/success", { state: { paymentData } })
  const { paymentData } = location.state || {};
  const { orderId, amount, paidAt, status } = paymentData || {};

  // Xóa giỏ hàng khi vào trang thanh toán thành công
  useEffect(() => {
    if (userId) {
      dispatch(clearCartAsync(userId));
    }
  }, [dispatch, userId]);

  const handleClose = () => navigate("/profile?tab=don-hang");

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-xl text-green-700">
            Thanh toán thành công
          </DialogTitle>
          <DialogDescription className="text-center text-slate-600">
            Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đang được xử lý.
          </DialogDescription>
        </DialogHeader>

        {/* Chi tiết thanh toán */}
        <div className="py-4 space-y-3">
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Mã đơn hàng:</span>
              <span className="text-sm font-medium">#{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Số tiền:</span>
              <span className="text-sm font-medium">
                {amount?.toLocaleString("vi-VN")} ₫
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Trạng thái:</span>
              <span className="text-sm font-medium text-green-700">
                {status === "Draft" ? "Đã thanh toán" : status}
              </span>
            </div>
            {paidAt && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">
                  Thời gian thanh toán:
                </span>
                <span className="text-sm font-medium">
                  {new Date(paidAt).toLocaleString("vi-VN")}
                </span>
              </div>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              Giao dịch đã được xác nhận. Bạn có thể xem chi tiết đơn hàng trong
              trang cá nhân.
            </p>
          </div>
        </div>

        <DialogFooter className="justify-center">
          <Button
            onClick={handleClose}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Về trang cá nhân
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
