import React from "react";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { type Category, type CategoryDetailDialogProps } from "../types";

export default function CategoryDetailDialog({
  open,
  setIsOpen,
  category,
}: CategoryDetailDialogProps) {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thông tin danh mục {category.id}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Tên danh mục
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {category.name}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Mô tả
                </label>
                <p className="text-gray-900">{category.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Ngày tạo
                </label>
                <p className="text-gray-900">{category.createdDate}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Trạng thái
                </label>
                <Badge
                  variant={
                    category.status === "active" ? "default" : "secondary"
                  }
                  className={
                    category.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                >
                  {category.status === "active"
                    ? "Hoạt động"
                    : "Không hoạt động"}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Số sản phẩm
                </label>
                <p className="text-lg font-semibold text-gray-900">
                  {category.productCount} sản phẩm
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Đóng
          </Button>
          <Button className="bg-[#3770EC] hover:bg-[#3770EC]/90">
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
