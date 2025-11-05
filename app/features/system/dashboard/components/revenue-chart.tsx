import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { formatVND } from "~/libs";
import { getMonthlyRevenueStats, getMonthlyProfit } from "~/services/dashboard";
import { Loader2 } from "lucide-react";

const monthMap: Record<string, string> = {
  T1: "Tháng 1",
  T2: "Tháng 2",
  T3: "Tháng 3",
  T4: "Tháng 4",
  T5: "Tháng 5",
  T6: "Tháng 6",
  T7: "Tháng 7",
  T8: "Tháng 8",
  T9: "Tháng 9",
  T10: "Tháng 10",
  T11: "Tháng 11",
  T12: "Tháng 12",
};

export default function RevenueChart() {
  const MIN_YEAR = 2000;
  const MAX_YEAR = new Date().getFullYear();
  const [yearInput, setYearInput] = useState<string>(
    String(new Date().getFullYear())
  );
  const [appliedYear, setAppliedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [activeTab, setActiveTab] = useState<"revenue" | "profit">("revenue");

  // Query for revenue
  const {
    data: revenueRes,
    isLoading: isLoadingRevenue,
    isError: isErrorRevenue,
  } = useQuery({
    queryKey: ["monthly-revenue-stats", appliedYear],
    queryFn: () => getMonthlyRevenueStats({ year: appliedYear }),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
  });

  // Query for profit
  const {
    data: profitRes,
    isLoading: isLoadingProfit,
    isError: isErrorProfit,
  } = useQuery({
    queryKey: ["monthly-profit-stats", appliedYear],
    queryFn: () => getMonthlyProfit({ year: appliedYear }),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
  });

  const revenueData =
    revenueRes?.data?.map((item: any) => ({
      name: item.period,
      revenue: Number(item.revenue) || 0,
      orderCount: item.orderCount,
    })) ?? [];

  const profitData =
    profitRes?.data?.map((item: any) => ({
      name: item.period,
      profit: Number(item.profit) || 0,
      totalRevenue: Number(item.totalRevenue) || 0,
      totalCost: Number(item.totalCost) || 0,
      shippingRevenue: Number(item.shippingRevenue) || 0,
      profitMargin: Number(item.profitMargin) || 0,
    })) ?? [];

  const isLoading =
    activeTab === "revenue" ? isLoadingRevenue : isLoadingProfit;
  const hasData =
    activeTab === "revenue" ? revenueData.length > 0 : profitData.length > 0;

  // Hàm format ngắn gọn cho trục Y (hỗ trợ số âm)
  const formatYAxis = (value: number) => {
    const sign = value < 0 ? "-" : "";
    const abs = Math.abs(value);
    if (abs >= 1000000) {
      return `${sign}${(abs / 1000000).toFixed(1)}tr`;
    }
    if (abs >= 1000) {
      return `${sign}${(abs / 1000).toFixed(0)}k`;
    }
    return `${sign}${abs.toString()}`;
  };

  // force Recharts to recalc size when data arrives (fix when chart is in tabs/hidden)
  useEffect(() => {
    if (revenueData.length || profitData.length) {
      // small delay to let DOM layout
      const t = setTimeout(
        () => window.dispatchEvent(new Event("resize")),
        120
      );
      return () => clearTimeout(t);
    }
  }, [revenueData.length, profitData.length, activeTab]);

  return (
    <div className="col-span-2">
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground ">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="text-2xl font-semibold">
                {activeTab === "revenue" ? "Doanh thu" : "Lợi nhuận"}
              </CardTitle>
              <CardDescription className="text-sm">
                Thống kê {activeTab === "revenue" ? "doanh thu" : "lợi nhuận"}{" "}
                theo tháng năm {appliedYear}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={yearInput}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!/^\d*$/.test(v)) return;
                  if (v.length > 4) return;
                  setYearInput(v);
                }}
                className="w-28"
                placeholder="Năm"
              />
              <Button
                size="sm"
                variant="primary"
                disabled={
                  isLoading ||
                  !yearInput.trim() ||
                  Number(yearInput) < MIN_YEAR ||
                  Number(yearInput) > MAX_YEAR
                }
                onClick={() => {
                  // clamp to allowed range
                  const raw = Number(yearInput) || MAX_YEAR;
                  const y = Math.min(Math.max(raw, MIN_YEAR), MAX_YEAR);
                  setAppliedYear(y);
                  setYearInput(String(y));
                }}
                title={`Năm phải trong khoảng ${MIN_YEAR} - ${MAX_YEAR}`}
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "revenue" | "profit")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
              <TabsTrigger value="profit">Lợi nhuận</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue" className="h-[350px]">
              {isLoadingRevenue ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang tải...</span>
                  </div>
                </div>
              ) : revenueData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Không có dữ liệu
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatYAxis} width={80} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (
                          active &&
                          payload &&
                          payload.length &&
                          typeof label === "string"
                        ) {
                          return (
                            <div className="bg-white p-2 rounded shadow border">
                              <p className="font-semibold">
                                {monthMap[label] || label}
                              </p>
                              <p className="text-[#8884D8]">
                                Doanh thu: {formatVND(payload[0].value)}
                              </p>
                              <p className="text-gray-600">
                                Đơn hàng: {payload[0].payload.orderCount}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="revenue" fill="#8884D8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>

            <TabsContent value="profit" className="h-[350px]">
              {isLoadingProfit ? (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang tải...</span>
                  </div>
                </div>
              ) : profitData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Không có dữ liệu
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={profitData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={formatYAxis} width={80} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (
                          active &&
                          payload &&
                          payload.length &&
                          typeof label === "string"
                        ) {
                          const profitVal = Number(payload[0].value) || 0;
                          return (
                            <div className="bg-white p-3 rounded shadow border">
                              <p className="font-semibold mb-2">
                                {monthMap[label] || label}
                              </p>
                              <p
                                className={
                                  profitVal < 0
                                    ? "text-red-500"
                                    : "text-[#10B981]"
                                }
                              >
                                Lợi nhuận: {formatYAxis(profitVal)}
                              </p>
                              <p className="text-gray-600">
                                Doanh thu:{" "}
                                {formatYAxis(payload[0].payload.totalRevenue)}
                              </p>
                              <p className="text-gray-600">
                                Chi phí:{" "}
                                {formatYAxis(payload[0].payload.totalCost)}
                              </p>
                              <p className="text-gray-600">
                                Phí ship:{" "}
                                {formatYAxis(
                                  payload[0].payload.shippingRevenue
                                )}
                              </p>
                              <p className="text-gray-600 font-medium">
                                Tỷ lệ LN:{" "}
                                {payload[0].payload.profitMargin.toFixed(2)}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="profit" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
