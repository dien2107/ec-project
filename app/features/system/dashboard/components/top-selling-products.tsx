import { ChevronRight, Download } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { fakeTopSellingProductsData } from "../data/fakeVisualReports";

const formatVND = (amount: number) =>
  Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

export default function TopSellingProducts() {
  return (
    <div className="col-span-2">
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
              <Download />
              Xuất báo cáo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] font-medium text-gray-500 text-sm">
                  Sản phẩm
                </TableHead>
                <TableHead className="font-medium text-gray-500 text-sm">
                  Danh mục
                </TableHead>
                <TableHead className="text-right font-medium text-gray-500 text-sm">
                  Đã bán
                </TableHead>
                <TableHead className="text-right font-medium text-gray-500 text-sm">
                  Doanh thu
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fakeTopSellingProductsData.map((product) => (
                <TableRow key={product.product}>
                  <TableCell className="font-medium">
                    {product.product}
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">{product.sold}</TableCell>
                  <TableCell className="text-right">
                    {formatVND(product.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="bg-white flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Cập nhật lúc 09:30 AM, 03/05/2025
            </p>
            <Button variant="outline">
              Xem tất cả
              <ChevronRight />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
