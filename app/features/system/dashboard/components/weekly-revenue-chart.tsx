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

import { fakeWeeklyRevenueData } from "../data/fakeVisualReports";

const weekMap: Record<string, string> = {
  CN: "Chủ nhật",
  T2: "Thứ 2",
  T3: "Thứ 3",
  T4: "Thứ 4",
  T5: "Thứ 5",
  T6: "Thứ 6",
  T7: "Thứ 7",
};

const formatVND = (amount: number) =>
  Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

export default function WeeklyRevenueChart() {
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
              data={fakeWeeklyRevenueData}
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
