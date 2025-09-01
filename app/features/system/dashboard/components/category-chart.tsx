import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { fakeCategoryData } from "../data/fakeVisualReports";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function RevenueChart() {
  return (
    <div className="col-span-1">
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground ">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="text-2xl font-semibold">
                Phân bổ doanh mục
              </CardTitle>
              <CardDescription className="text-sm">
                Tỷ lệ sản phẩm bán ra theo danh mục
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={322} height={220}>
              <Pie
                data={fakeCategoryData}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={(entry) => {
                  const value = entry.value ?? 0;
                  const total = fakeCategoryData.reduce(
                    (acc, cur) => acc + cur.value,
                    0
                  );
                  const percent = ((value / total) * 100).toFixed(1);
                  return `${percent}%`;
                }}
              >
                {fakeCategoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
