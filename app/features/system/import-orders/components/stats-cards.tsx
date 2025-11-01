import React from "react";
import {
  Package,
  Clock,
  CheckCircle,
  DollarSign,
  FileText,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface ImportOrderStatsProps {
  totalOrders: number;
  draftOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalValue: number;
  totalProducts: number;
}

export function ImportOrderStats({
  totalOrders,
  draftOrders,
  pendingOrders,
  completedOrders,
  totalValue,
  totalProducts,
}: ImportOrderStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const stats = [
    {
      title: "Tổng đơn hàng",
      value: totalOrders,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Bản nháp",
      value: draftOrders,
      icon: Package,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      title: "Chờ duyệt",
      value: pendingOrders,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Hoàn tất",
      value: completedOrders,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Tổng giá trị",
      value: formatCurrency(totalValue),
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      isString: true,
    },
    {
      title: "Tổng sản phẩm",
      value: totalProducts,
      icon: ShoppingBag,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.isString ? stat.value : stat.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
