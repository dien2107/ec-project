import {
  ArrowDown,
  ArrowUp,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const formatVND = (amount: number) =>
  Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

export default function StatisticCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Income */}
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground gap-0">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
          <TrendingUp size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatVND(142500000)}</div>
          <div className="flex items-center text-xs text-green-500 gap-1 mt-1">
            <ArrowUp size={12} />
            <span className="">12.5% so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      {/* Order */}
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground gap-0">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
          <ShoppingBag size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">258</div>
          <div className="flex items-center text-xs text-green-500 gap-1 mt-1">
            <ArrowUp size={12} />
            <span className="">8.2% so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      {/* Customer */}
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground gap-0">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
          <Users size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">45</div>
          <div className="flex items-center text-xs text-green-500 gap-1 mt-1">
            <ArrowUp size={12} />
            <span className="">5.8% so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      {/* Product */}
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground gap-0">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Sản phẩm bán ra</CardTitle>
          <Package size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">580</div>
          <div className="flex items-center text-xs text-red-500 gap-1 mt-1">
            <ArrowDown size={12} />
            <span className="">2.8% so với tháng trước</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
