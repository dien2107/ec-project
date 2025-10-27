import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { Button } from "~/components/ui/button";
import { User, CreditCard, Truck, Package } from "lucide-react";
import { statusMap, type Order } from "../types";
import OrderDetail from "./order-detail";
import { toast } from "react-hot-toast";
import { approveOrder, cancelOrder } from "~/services/order";
import { useAppDispatch } from "~/redux/store";
import { fetchOrderListData } from "~/redux/slices/orders";
import { ConfirmActionDialog } from "./confirmation-modal";
function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export default function ViewOrderDetailDialog({
  order,
  open,
  setIsOpen,
}: {
  order: Order | null;
  open: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const handleCancel = async () => {
    if (!order) return;
    try {
      const response = await cancelOrder(order.orderId);
      if (!response.isSuccess) {
        toast.error(response.message || "Hủy đơn hàng thất bại.");
        return;
      }
      toast.success("Hủy đơn hàng thành công.");
      setIsOpen(false);
      dispatch(fetchOrderListData());
    } catch (ex) {
      const error = ex as Error;
      toast.error(error.message || "Hủy đơn hàng thất bại.");
    }
  };
  const handleApprove = async () => {
    if (!order) return;
    try {
      const response = await approveOrder(order.orderId);
      if (!response.isSuccess) {
        toast.error(response.message || "Duyệt đơn hàng thất bại.");
        return;
      }
      toast.success("Duyệt đơn hàng thành công.");
      setIsOpen(false);
      dispatch(fetchOrderListData());
    } catch (ex) {
      const error = ex as Error;
      toast.error(error.message || "Duyệt đơn hàng thất bại.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent
        className="min-w-[900px] max-w-[860px] bg-[#F8FAFC] "
        aria-describedby={undefined}
      >
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">
            Chi tiết đơn hàng {`#${order?.orderId}`}
          </DialogTitle>
        </DialogHeader>

        {/* Start: Dialog body */}
        <div className="overflow-y-auto scrollbar-custom max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4 mb-4 mx-1">
            <Card className="col-span-1 gap-2 shadow-xs">
              <CardHeader>
                <CardTitle>
                  <h3 className=" font-semibold text-lg flex items-center gap-2">
                    <User />
                    Thông tin khách hàng
                  </h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1">
                  <p>
                    <span className="font-medium">Tên:</span>{" "}
                    {order?.user.fullName}
                  </p>
                  <p>
                    <span className="font-medium">Số điện thoại:</span>{" "}
                    0901234567
                  </p>
                  <p>
                    <span className="font-medium">Địa chỉ:</span>{" "}
                    {order?.addressInfo}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 gap-2 shadow-xs">
              <CardHeader>
                <CardTitle>
                  <h3 className=" font-semibold text-lg flex items-center gap-2">
                    <Package />
                    Thông tin đơn hàng
                  </h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1">
                  <p>
                    <span className="font-medium">Ngày đặt:</span>{" "}
                    {new Date(order?.createdAt ?? "").toLocaleDateString(
                      "en-GB"
                    )}
                  </p>
                  <p>
                    <span className="font-medium">Trạng thái:</span>
                    <span
                      className={`${statusMap[order?.status?.name as keyof typeof statusMap]?.color ?? "bg-gray-400"} py-1 px-2 rounded-lg text-white text-sm ml-2`}
                    >
                      {statusMap[order?.status?.name as keyof typeof statusMap]
                        ?.label ?? "Không rõ"}
                    </span>
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="font-medium flex items-center gap-1">
                      <CreditCard />
                      Thanh toán:
                    </span>{" "}
                    COD
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="font-medium flex items-center gap-1">
                      <Truck />
                      Hình thức giao hàng:
                    </span>
                    {order?.ship === null
                      ? "Chưa xác định"
                      : order?.ship?.corpName}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table show list items */}
          <OrderDetail order={order} />
          {/* End: Dialog body */}
        </div>

        <DialogFooter className="py-4 border-t-2">
          <ConfirmActionDialog
            title="Xác nhận hủy đơn hàng"
            description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
            onConfirm={handleCancel} // Gọi function cancel khi confirm
          >
            <Button variant="outline" className=" text-red-500  cursor-pointer">
              Hủy đơn
            </Button>
          </ConfirmActionDialog>

          <ConfirmActionDialog
            title="Xác nhận duyệt đơn hàng"
            description="Bạn có chắc chắn muốn duyệt đơn hàng này không?"
            confirmText="Duyệt"
            onConfirm={handleApprove} // Gọi function approve khi confirm
          >
            <Button className="bg-[#3770EC] text-white cursor-pointer">
              Duyệt đơn hàng
            </Button>
          </ConfirmActionDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
