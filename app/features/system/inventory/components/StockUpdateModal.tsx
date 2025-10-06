import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Product, StockUpdateModalProps } from "../types";

const StockUpdateModal: React.FC<StockUpdateModalProps> = ({
  product,
  open,
  onOpenChange,
  onUpdate,
}) => {
  const [newStock, setNewStock] = useState(0);
  const [updateType, setUpdateType] = useState<"set" | "add" | "subtract">(
    "set"
  );

  useEffect(() => {
    if (product) {
      setNewStock(product.currentStock);
      setUpdateType("set");
    }
  }, [product]);

  if (!product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalStock = newStock;

    if (updateType === "add") {
      finalStock = product.currentStock + newStock;
    } else if (updateType === "subtract") {
      finalStock = Math.max(0, product.currentStock - newStock);
    }

    onUpdate(product.id, finalStock);
    onOpenChange(false);
  };

  const getPreviewStock = () => {
    if (updateType === "set") return newStock;
    if (updateType === "add") return product.currentStock + newStock;
    return Math.max(0, product.currentStock - newStock);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cập nhật tồn kho - {product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              Tồn kho hiện tại:
              <span className="font-semibold text-gray-900 ml-1">
                {product.currentStock}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="updateType">Loại cập nhật</Label>
            <Select
              value={updateType}
              onValueChange={(value: any) => setUpdateType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="set">Đặt số lượng mới</SelectItem>
                <SelectItem value="add">Nhập thêm hàng</SelectItem>
                <SelectItem value="subtract">Xuất hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newStock">
              {updateType === "set"
                ? "Số lượng mới"
                : updateType === "add"
                  ? "Số lượng nhập"
                  : "Số lượng xuất"}
            </Label>
            <Input
              id="newStock"
              type="number"
              value={newStock}
              onChange={e => setNewStock(Number(e.target.value))}
              min="0"
              required
            />
          </div>

          {updateType !== "set" && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                Tồn kho sau cập nhật:
                <span className="font-semibold ml-1">{getPreviewStock()}</span>
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={() => handleSubmit({ preventDefault: () => {} } as any)}
            >
              Cập nhật
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default StockUpdateModal;
