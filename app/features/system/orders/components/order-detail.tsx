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
import { Package } from "lucide-react";

export default function OrderDetail({ order }: { order: any }) {
  return (
    <Card className="shadow-sm mx-1 border border-gray-200 rounded-xl overflow-hidden">
      {/* 🔹 Tiêu đề */}
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <CardTitle>
          <h3 className="font-bold text-lg flex items-center gap-2.5 text-gray-800">
            <Package className="w-5 h-5 text-gray-600" />
            Danh sách sản phẩm
          </h3>
        </CardTitle>
      </CardHeader>

      {/* 🔹 Nội dung */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Sản phẩm
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Size
                </TableHead>
                <TableHead className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Số lượng
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Đơn giá
                </TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Thành tiền
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {order?.items?.map((item: any, index: number) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* 🔹 Tên + Ảnh + SKU */}
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-800 text-sm leading-snug">
                          {item.productName}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          SKU: {item.sku}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* 🔹 Size */}
                  <TableCell className="px-4 py-4 text-center align-middle">
                    <Badge
                      variant="secondary"
                      className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-medium"
                    >
                      {item.size}
                    </Badge>
                  </TableCell>

                  {/* 🔹 Số lượng */}
                  <TableCell className="px-4 py-4 text-center align-middle font-semibold text-gray-800">
                    ×{item.quantity}
                  </TableCell>

                  {/* 🔹 Giá đơn */}
                  <TableCell className="px-4 py-4 text-right align-middle text-gray-700 font-medium">
                    {formatVND(item.price)}
                  </TableCell>

                  {/* 🔹 Thành tiền */}
                  <TableCell className="px-4 py-4 text-right align-middle font-bold text-gray-800">
                    {formatVND(item.subTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            {/* 🔹 Footer - Tổng tiền chi tiết */}
            <TableFooter>
              <TableRow className="bg-gray-50 border-t-2 border-gray-200">
                <TableCell colSpan={5} className="px-6 py-4">
                  <div className="flex justify-end">
                    <div className="space-y-2.5 min-w-[350px]">
                      {/* Tạm tính */}
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="font-medium">Tạm tính:</span>
                        <span className="font-semibold">
                          {formatVND(
                            (order?.totalAmount ?? 0) -
                              (order?.shippingFee ?? 0)
                          )}
                        </span>
                      </div>

                      {/* Phí vận chuyển */}
                      <div className="flex justify-between items-center text-gray-600">
                        <span className="font-medium">Phí vận chuyển:</span>
                        <span className="font-semibold">
                          {order?.isFreeShip ? (
                            <span className="text-green-600">Miễn phí</span>
                          ) : (
                            formatVND(order?.shippingFee ?? 0)
                          )}
                        </span>
                      </div>

                      {/* Giảm giá (nếu có) */}
                      {order?.discount && (
                        <div className="flex justify-between items-center text-green-600">
                          <span className="font-medium">Giảm giá:</span>
                          <span className="font-semibold">
                            -{formatVND(order?.discount ?? 0)}
                          </span>
                        </div>
                      )}

                      {/* Divider */}
                      <div className="h-px bg-gray-300 my-2"></div>

                      {/* Tổng cộng */}
                      <div className="flex justify-between items-center bg-blue-50 -mx-2 px-2 py-2 rounded-lg">
                        <span className="text-lg font-bold text-gray-800">
                          Tổng cộng:
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {formatVND(order?.totalAmount ?? 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
