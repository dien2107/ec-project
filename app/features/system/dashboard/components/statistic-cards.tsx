import {
  ArrowDown,
  ArrowUp,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatVND } from "~/libs";
import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "~/services/dashboard";

export default function StatisticCards() {
  const { data: res, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardOverview,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
  });

  const stats = res?.data ?? res ?? {};

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-16">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const renderChange = (percent: number) => {
    const isPositive = percent >= 0;
    const Icon = isPositive ? ArrowUp : ArrowDown;
    const color = isPositive ? "text-green-500" : "text-red-500";
    return (
      <div className={`flex items-center text-xs ${color} gap-1 mt-1`}>
        <Icon size={12} />
        <span>{`${Math.abs(percent)}% so với tháng trước`}</span>
      </div>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Income */}
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground gap-0">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
          <TrendingUp size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : formatVND(stats.monthlyRevenue)}
          </div>
          {isLoading ? (
            <div className="text-xs mt-1">Đang tải...</div>
          ) : (
            renderChange(stats.revenueChangePercent)
          )}
        </CardContent>
      </Card>

      {/* Order */}
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground gap-0">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
          <ShoppingBag size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats.totalOrders}
          </div>
          {isLoading ? (
            <div className="text-xs mt-1">Đang tải...</div>
          ) : (
            renderChange(stats.orderChangePercent)
          )}
        </CardContent>
      </Card>

      {/* Customer */}
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground gap-0">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
          <Users size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats.newCustomers}
          </div>
          {isLoading ? (
            <div className="text-xs mt-1">Đang tải...</div>
          ) : (
            renderChange(stats.customerChangePercent)
          )}
        </CardContent>
      </Card>

      {/* Product */}
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground gap-0">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Sản phẩm bán ra</CardTitle>
          <Package size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "..." : stats.productsSold}
          </div>
          {isLoading ? (
            <div className="text-xs mt-1">Đang tải...</div>
          ) : (
            renderChange(stats.productChangePercent)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
