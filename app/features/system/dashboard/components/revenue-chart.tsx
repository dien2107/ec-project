import { ArrowUp, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fakeRevenueData } from "../data/fakeVisualReports";

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

const formatVND = (amount: number) =>
  Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);

export default function RevenueChart() {
  return (
    <div className="col-span-2">
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground ">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="text-2xl font-semibold">
                Doanh thu
              </CardTitle>
              <CardDescription className="text-sm">
                Thống kê doanh thu theo tháng
              </CardDescription>
            </div>
            <Select defaultValue="this-month">
              <SelectTrigger className="max-w-[160] h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="this-month">Tháng này</SelectItem>
                  <SelectItem value="prev-month">Tháng trước</SelectItem>
                  <SelectItem value="last-3-months">
                    3 tháng gần nhất
                  </SelectItem>
                  <SelectItem value="this-year">Năm nay</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width={717} height="100%">
            <BarChart
              data={fakeRevenueData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
                        <p>{monthMap[label] || label}</p>
                        <p className="text-[#8884D8]">
                          Doanh thu: {formatVND(payload[0].value)}
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
        </CardContent>
      </Card>
    </div>
  );
}
