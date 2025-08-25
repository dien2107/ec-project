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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { User, CreditCard, Truck, Package } from "lucide-react";

function formatVND(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

export default function ViewOrderDetailDialog({
  open,
  setIsOpen,
}: {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="min-w-[860px] max-w-[860px] bg-[#F8FAFC] ">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl">
            Chi tiết đơn hàng ORD-001
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
                    <span className="font-medium">Tên:</span> Nguyễn Văn A
                  </p>
                  <p>
                    <span className="font-medium">Số điện thoại:</span>{" "}
                    0901234567
                  </p>
                  <p>
                    <span className="font-medium">Địa chỉ:</span> 123 Đường Lê
                    Lợi, Phường Bến Nghé, Quận 1, TP.HCM
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
                    <span className="font-medium">Ngày đặt:</span> 01/01/2023
                  </p>
                  <p>
                    <span className="font-medium">Trạng thái:</span>
                    <span className="bg-yellow-500 py-1 px-2 rounded-lg text-white text-sm ml-2">
                      Chờ xử lý
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
                    Giao hàng nhanh
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table show list items */}
          <Card className="shadow-xs mx-1">
            <CardHeader>
              <CardTitle>
                <h3 className=" font-semibold text-lg flex items-center gap-2">
                  Sản phẩm
                </h3>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] font-medium text-gray-400">
                      Mã SP
                    </TableHead>
                    <TableHead className="font-medium text-gray-400">
                      Tên sản phẩm
                    </TableHead>
                    <TableHead className="font-medium text-gray-400">
                      Số lượng
                    </TableHead>
                    <TableHead className="text-right font-medium text-gray-400">
                      Đơn giá
                    </TableHead>
                    <TableHead className="text-right font-medium text-gray-400">
                      Thành tiền
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>VAR-001</TableCell>
                    <TableCell className="flex flex-col gap-1">
                      <span>Áo thun YAME Basic</span>
                      <span className="text-xs">Trắng - M</span>
                    </TableCell>
                    <TableCell className="text-right">2</TableCell>
                    <TableCell className="text-right flex flex-col">
                      <span>{formatVND(1200000)}</span>
                      <span className="text-sm line-through text-gray-500">
                        {formatVND(2000000)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatVND(1200000 * 2)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>VAR-001</TableCell>
                    <TableCell className="flex flex-col gap-1">
                      <span>Áo thun YAME Basic</span>
                      <span className="text-xs">Trắng - M</span>
                    </TableCell>
                    <TableCell className="text-right">2</TableCell>
                    <TableCell className="text-right flex flex-col">
                      <span>{formatVND(1200000)}</span>
                      <span className="text-sm line-through text-gray-500">
                        {formatVND(2000000)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatVND(1200000 * 2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4} className="text-right">
                      Tổng cộng
                    </TableCell>
                    <TableCell className="text-right">
                      {" "}
                      {formatVND(1200000 * 4)}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
          {/* End: Dialog body */}
        </div>

        <DialogFooter className="py-4 border-t-2">
          <Button variant="outline" className=" text-red-500  cursor-pointer">
            Hủy đơn
          </Button>

          <Button
            type="submit"
            className="bg-[#3770EC] text-white cursor-pointer"
          >
            Duyệt đơn hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
