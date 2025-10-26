import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { formatVND } from "~/libs/format";
import { Badge } from "~/components/ui/badge";

export default function OrderDetail({ order }: { order: any }) {
  return (
    <Card className="shadow-sm mx-1 border border-gray-100 rounded-2xl">
      <CardHeader className="bg-gray-50 rounded-t-2xl px-5 py-3 border-b">
        <CardTitle>
          <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-700">
            🛍️ Danh sách sản phẩm
          </h3>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[100px] text-gray-500 font-medium uppercase text-xs">
                Mã SP
              </TableHead>
              <TableHead className="text-gray-500 font-medium uppercase text-xs">
                Tên sản phẩm
              </TableHead>
              <TableHead className="text-gray-500 font-medium uppercase text-xs text-center">
                Số lượng
              </TableHead>
              <TableHead className="text-gray-500 font-medium uppercase text-xs text-right">
                Đơn giá
              </TableHead>
              <TableHead className="text-gray-500 font-medium uppercase text-xs text-right">
                Thành tiền
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {order?.items?.map((item: any, index: number) => (
              <TableRow
                key={index}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <TableCell className="font-medium text-gray-700">
                  {item.sku}
                </TableCell>

                <TableCell className="flex flex-col gap-1">
                  <span className="font-medium text-gray-800">
                    {item.productName}
                  </span>
                  <span className="text-xs text-gray-500">
                    <Badge variant="secondary" className="text-[10px]">
                      Size {item.size}
                    </Badge>
                  </span>
                </TableCell>

                <TableCell className="text-center font-medium text-gray-700">
                  {item.quantity}
                </TableCell>

                <TableCell className="text-right text-gray-700">
                  {formatVND(item.price)}
                </TableCell>

                <TableCell className="text-right font-semibold text-gray-800">
                  {formatVND(item.subTotal)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter>
            <TableRow className="bg-gray-50">
              <TableCell colSpan={4} className="text-right font-medium">
                Tổng cộng
              </TableCell>
              <TableCell className="text-right font-bold text-primary text-lg">
                {formatVND(order?.totalAmount ?? 0)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
