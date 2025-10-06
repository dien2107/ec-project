import React, { useState } from "react";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { ImportRecord } from "../types";
import { getStatusColor, getStatusLabel } from "../types";

interface ImportDetailDialogProps {
  importRecord: ImportRecord | null;
  isOpen: boolean;
  onClose: () => void;
  formatCurrency: (amount: number) => string;
}

const ImportDetailDialog: React.FC<ImportDetailDialogProps> = ({
  importRecord,
  isOpen,
  onClose,
  formatCurrency,
}) => {
  const [activeTab, setActiveTab] = useState<string>("info");

  if (!importRecord) return null;

  const handleExportReport = () => {
    console.log("Exporting report for:", importRecord.id);
    // Add export logic here
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Chi tiết nhập hàng {importRecord.id}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin chung</TabsTrigger>
            <TabsTrigger value="items">
              Chi tiết sản phẩm ({importRecord.items.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="info"
            className="mt-6 space-y-6 overflow-y-auto max-h-[calc(90vh-250px)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Nhà cung cấp
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {importRecord.supplier}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Ngày nhập
                  </label>
                  <p className="text-gray-900">{importRecord.importDate}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Người tạo
                  </label>
                  <p className="text-gray-900">{importRecord.createdBy}</p>
                </div>

                {importRecord.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 block mb-1">
                      Ghi chú
                    </label>
                    <p className="text-gray-900">{importRecord.notes}</p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Trạng thái
                  </label>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(importRecord.status)}
                  >
                    {getStatusLabel(importRecord.status)}
                  </Badge>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Tổng số lượng
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {importRecord.quantity} sản phẩm
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 block mb-1">
                    Tổng giá trị
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(importRecord.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="items"
            className="mt-6 overflow-y-auto max-h-[calc(90vh-250px)]"
          >
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 border-b pb-2">
                <div>Tên sản phẩm</div>
                <div>Danh mục</div>
                <div className="text-right">Số lượng</div>
                <div className="text-right">Đơn giá</div>
                <div className="text-right">Thành tiền</div>
                <div>Mã sản phẩm</div>
              </div>

              {/* Table Rows */}
              {importRecord.items.map(item => (
                <div
                  key={item.id}
                  className="grid grid-cols-6 gap-4 py-3 border-b border-gray-100"
                >
                  <div className="font-medium text-gray-900">
                    {item.productName}
                  </div>
                  <div className="text-gray-600">{item.category}</div>
                  <div className="text-gray-900 text-right">
                    {item.quantity}
                  </div>
                  <div className="text-gray-900 text-right">
                    {formatCurrency(item.unitPrice)}
                  </div>
                  <div className="font-medium text-gray-900 text-right">
                    {formatCurrency(item.totalPrice)}
                  </div>
                  <div className="text-gray-600 font-mono text-sm">
                    {item.id}
                  </div>
                </div>
              ))}

              {/* Total */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Tổng cộng:
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(importRecord.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button
            onClick={handleExportReport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDetailDialog;
