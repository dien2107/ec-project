import { ChevronRight, Download, Loader2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getTopSellingProducts } from "~/services/dashboard";
import { formatVND } from "~/libs";
import { useState, useMemo } from "react";
import Pagination from "~/components/common/pagination";

export default function TopSellingProducts() {
  const MIN_YEAR = 2000;
  const MAX_YEAR = new Date().getFullYear();
  const ITEMS_PER_PAGE = 5;

  const [top, setTop] = useState(10);
  const [yearInput, setYearInput] = useState<string>(
    String(new Date().getFullYear())
  );
  const [appliedYear, setAppliedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: res,
    isLoading,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["top-selling-products", top, appliedYear],
    queryFn: () => getTopSellingProducts({ top, year: appliedYear }),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: true,
  });

  const items = res?.data ?? res ?? [];

  // Pagination logic
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  // Reset to page 1 when filters change
  const handleApplyFilters = () => {
    const raw = Number(yearInput) || 0;
    if (raw === 0) {
      setAppliedYear(0);
      setYearInput("0");
    } else {
      const y = Math.min(Math.max(raw, MIN_YEAR), MAX_YEAR);
      setAppliedYear(y);
      setYearInput(String(y));
    }
    setCurrentPage(1);
  };

  // Format timestamp to readable format
  const formatUpdateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };

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
                Top {top} sản phẩm bán chạy nhất năm {appliedYear}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={top.toString()}
                onValueChange={(val) => {
                  setTop(Number(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Top" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">Top 5</SelectItem>
                  <SelectItem value="10">Top 10</SelectItem>
                  <SelectItem value="20">Top 20</SelectItem>
                  <SelectItem value="50">Top 50</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={yearInput}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!/^\d*$/.test(v)) return;
                  if (v.length > 4) return;
                  setYearInput(v);
                }}
                className="w-28"
                placeholder="Năm (0=tất cả)"
              />
              <Button
                size="sm"
                variant="primary"
                disabled={
                  isLoading ||
                  !yearInput.trim() ||
                  (Number(yearInput) !== 0 &&
                    (Number(yearInput) < MIN_YEAR ||
                      Number(yearInput) > MAX_YEAR))
                }
                onClick={handleApplyFilters}
                title={`Nhập 0 để xem tất cả, hoặc năm trong khoảng ${MIN_YEAR} - ${MAX_YEAR}`}
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] font-medium text-gray-500 text-sm">
                  STT
                </TableHead>
                <TableHead className="w-[64px] font-medium text-gray-500 text-sm">
                  ID
                </TableHead>
                <TableHead className="w-[56px] font-medium text-gray-500 text-sm">
                  Hình
                </TableHead>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Đang tải...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-muted-foreground"
                  >
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                paginatedItems.map((product: any, index: number) => {
                  const globalIndex =
                    (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
                  return (
                    <TableRow key={product.productId ?? product.productName}>
                      <TableCell className="text-sm text-muted-foreground">
                        {globalIndex}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {product.productId ?? "-"}
                      </TableCell>
                      <TableCell className="p-0">
                        <div className="w-10 h-10 overflow-hidden rounded bg-muted flex items-center justify-center">
                          <img
                            src={product.productImage ?? "/placeholder-100.png"}
                            alt={product.productName ?? "product image"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "/placeholder-100.png";
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell
                        className="font-medium max-w-[220px] truncate"
                        title={product.productName ?? "-"}
                      >
                        {product.productName ?? "-"}
                      </TableCell>
                      <TableCell>
                        {product.categoryLv2Name ?? product.category ?? "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.totalQuantitySold ?? product.sold ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatVND(
                          product.totalRevenue ?? product.revenue ?? 0
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <div className="bg-white flex items-center justify-between mt-6">
            <p className="text-sm text-gray-500">
              Cập nhật lúc{" "}
              {dataUpdatedAt ? formatUpdateTime(dataUpdatedAt) : "---"}
            </p>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
