import {
  CartesianGrid,
  Line,
  LineChart,
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

import { formatVND } from "~/libs";
import { useQuery } from "@tanstack/react-query";
import { getWeeklySales } from "~/services/dashboard";

const weekMap: Record<string, string> = {
  CN: "Chủ nhật",
  T2: "Thứ 2",
  T3: "Thứ 3",
  T4: "Thứ 4",
  T5: "Thứ 5",
  T6: "Thứ 6",
  T7: "Thứ 7",
};

export default function WeeklyRevenueChart() {
  const { data: res, isLoading } = useQuery({
    queryKey: ["weekly-sales"],
    queryFn: () => getWeeklySales(),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
  });

  // helper: map API dayOfWeek or date -> short code (CN, T2..T7)
  const shortDayFromItem = (item: any) => {
    if (item?.dayOfWeek) {
      const s = item.dayOfWeek.toLowerCase();
      if (s.includes("chủ")) return "CN";
      if (s.includes("hai") || s.includes("thứ 2") || s.includes("t2"))
        return "T2";
      if (s.includes("ba") || s.includes("thứ 3") || s.includes("t3"))
        return "T3";
      if (s.includes("tư") || s.includes("thứ 4") || s.includes("t4"))
        return "T4";
      if (s.includes("năm") || s.includes("thứ 5") || s.includes("t5"))
        return "T5";
      if (s.includes("sáu") || s.includes("thứ 6") || s.includes("t6"))
        return "T6";
      if (s.includes("bảy") || s.includes("thứ 7") || s.includes("t7"))
        return "T7";
    }
    if (item?.date) {
      const d = new Date(item.date);
      const codes = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      return codes[d.getDay()] || "";
    }
    return "";
  };

  const chartData =
    res?.data?.map((item: any) => ({
      name: shortDayFromItem(item),
      revenue: item.revenue,
    })) ?? [];

  return (
    <div className="col-span-1 flex flex-1">
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground ">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="text-2xl font-semibold">
                Doanh số tuần
              </CardTitle>
              <CardDescription className="text-sm">
                Doanh số 7 ngày gần nhất
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width={322} height={200}>
            <LineChart
              width={322}
              height={200}
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (
                    active &&
                    payload &&
                    payload.length &&
                    typeof label === "string"
                  ) {
                    return (
                      <div className="bg-white p-2 rounded shadow">
                        <p>{weekMap[label] || label}</p>
                        <p className="text-[#8884D8]">
                          Doanh số: {formatVND(payload[0].value)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
