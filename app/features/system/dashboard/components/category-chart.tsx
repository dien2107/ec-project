import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCategorySalesPercentage } from "~/services/dashboard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { DatePicker } from "~/components/ui/date-picker";
import { Loader2 } from "lucide-react";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A569BD",
  "#F06292",
];

export default function CategoryChart() {
  const [tab, setTab] = useState<string>("preset"); // "preset" | "custom"
  const [preset, setPreset] = useState<string>("last-7-days");

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const params = useMemo(() => {
    if (tab === "preset") {
      return { preset };
    }
    return {
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    };
  }, [tab, preset, startDate, endDate]);

  const enabled = tab === "preset" ? true : !!(startDate && endDate);

  const { data: res, isLoading } = useQuery({
    queryKey: [
      "category-sales-percentage",
      tab,
      preset,
      startDate?.toISOString(),
      endDate?.toISOString(),
    ],
    queryFn: () => getCategorySalesPercentage(params),
    enabled,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
  });

  const items = res?.data ?? res ?? [];

  const total = items.reduce(
    (acc: number, cur: any) => acc + (cur.totalSales ?? 0),
    0
  );

  return (
    <div className="col-span-1">
      <Card className="shadow-sm rounded-lg border bg-card text-card-foreground ">
        <CardHeader>
          <div className="flex flex-col w-full gap-2">
            <div>
              <CardTitle className="text-2xl font-semibold">
                Phân bổ doanh mục
              </CardTitle>
              <CardDescription className="text-sm">
                Tỷ lệ doanh thu theo danh mục
              </CardDescription>
            </div>

            {/* Tabs (triggers) then controls shown under the tabs (aligned right) */}
            <div className="flex flex-col items-center gap-2">
              <Tabs value={tab} onValueChange={(v) => setTab(v)}>
                <TabsList>
                  <TabsTrigger value="preset" className="h-9 px-3">
                    Preset
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="h-9 px-3">
                    Tùy chỉnh
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div
                className={`w-full flex items-center ${tab === "preset" ? "justify-end" : "justify-center"}`}
              >
                {tab === "preset" ? (
                  <div className="min-w-[200px]">
                    <Select
                      value={preset}
                      onValueChange={(val: string) => setPreset(val)}
                    >
                      <SelectTrigger className="h-10 w-48">
                        <SelectValue placeholder="Chọn khoảng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Khoảng thời gian</SelectLabel>
                          <SelectItem value="last-7-days">
                            7 ngày gần nhất
                          </SelectItem>
                          <SelectItem value="this-month">Tháng này</SelectItem>
                          <SelectItem value="last-month">
                            Tháng trước
                          </SelectItem>
                          <SelectItem value="this-year">Năm nay</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="min-w-[140px] flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground font-medium capitalize">
                        từ ngày
                      </label>
                      <DatePicker
                        value={startDate}
                        onChange={(d: Date | undefined) => {
                          setStartDate(d);
                          if (d && endDate) setTab("custom");
                        }}
                        maxDate={new Date()}
                      />
                    </div>
                    <div className="min-w-[140px] flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground font-medium capitalize">
                        đến ngày
                      </label>
                      <DatePicker
                        value={endDate}
                        disabled={!startDate}
                        minDate={startDate}
                        onChange={(d: Date | undefined) => {
                          setEndDate(d);
                          if (startDate && d) setTab("custom");
                        }}
                        maxDate={new Date()}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="h-[350px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Đang tải...</span>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <p className="text-sm text-muted-foreground mb-2">
                Thống kê phân bổ danh mục chưa có dữ liệu
              </p>
              <p className="text-xs text-muted-foreground">
                Vui lòng thử khoảng thời gian khác
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={items}
                  dataKey="totalSales"
                  nameKey="categoryName"
                  outerRadius={90}
                  innerRadius={40}
                  labelLine={false}
                  label={(entry: any) => {
                    const pct =
                      entry.percentage ??
                      (total
                        ? ((entry.totalSales / total) * 100).toFixed(1)
                        : "0");
                    return `${pct}%`;
                  }}
                >
                  {items.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${entry.categoryName}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
