import { Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
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
import { formatVND } from "~/libs";
import { fakeRecentOrdersData } from "../data/fakeVisualReports";

const statusColorMap: Record<string, string> = {
  delivering: "blue-500",
  delivered: "green-500",
  pending: "yellow-500",
};

const statusTextMap: Record<string, string> = {
  delivering: "Đang giao",
  delivered: "Đã giao",
  pending: "Đang chờ",
};

export default function RecentOrders() {
  return (
    <div className="col-span-3">
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground ">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="text-2xl font-semibold">
                Sản phẩm bán chạy
              </CardTitle>
              <CardDescription className="text-sm">
                Top 5 sản phẩm bán chạy nhất
              </CardDescription>
            </div>
            <Button variant="outline">
              <Calendar />
              Xem tất cả
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] font-medium text-gray-500 text-sm">
                  Mã đơn
                </TableHead>
                <TableHead className="font-medium text-gray-500 text-sm">
                  Khách hàng
                </TableHead>
                <TableHead className="font-medium text-gray-500 text-sm">
                  Ngày đặt
                </TableHead>
                <TableHead className="font-medium text-gray-500 text-sm">
                  Trạng thái
                </TableHead>
                <TableHead className="text-right font-medium text-gray-500 text-sm">
                  Tổng tiền
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fakeRecentOrdersData.map((order) => (
                <TableRow key={order.orderId}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString("en-GB")}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full bg-${statusColorMap[order.status]}`}
                    ></div>
                    <span>{statusTextMap[order.status] || "Unknown"}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatVND(order.totalAmount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
