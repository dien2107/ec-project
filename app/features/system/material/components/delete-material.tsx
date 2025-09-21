import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { type Material } from "../types";

interface DeleteMaterialDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  material: Material | null;
  onDelete: (materialId: string) => void;
}

const getMaterialTypeLabel = (type: Material["type"]) => {
  switch (type) {
    case "cotton":
      return "Cotton";
    case "polyester":
      return "Polyester";
    case "silk":
      return "Silk";
    case "wool":
      return "Wool";
    case "linen":
      return "Linen";
    case "denim":
      return "Denim";
    case "leather":
      return "Leather";
    case "synthetic":
      return "Synthetic";
    default:
      return type;
  }
};

const getMaterialTypeColor = (type: Material["type"]) => {
  switch (type) {
    case "cotton":
      return "bg-green-100 text-green-800 hover:bg-green-100";
    case "polyester":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case "silk":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case "wool":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100";
    case "linen":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
    case "denim":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100";
    case "leather":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100";
    case "synthetic":
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
  }
};

export default function DeleteMaterialDialog({
  open,
  setIsOpen,
  material,
  onDelete,
}: DeleteMaterialDialogProps) {
  const handleDelete = () => {
    if (material) {
      onDelete(material.id);
      setIsOpen(false);
    }
  };

  if (!material) return null;

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Xác nhận xóa chất liệu
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600 mb-4">
            Bạn có chắc chắn muốn xóa chất liệu này không?
          </p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-900">Tên chất liệu:</span>
              <span className="text-gray-700 ml-2">{material.name}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-900">Mã chất liệu:</span>
              <span className="text-gray-700 ml-2 font-mono">
                {material.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900">Loại:</span>
              <Badge
                variant="secondary"
                className={getMaterialTypeColor(material.type)}
              >
                {getMaterialTypeLabel(material.type)}
              </Badge>
            </div>
            <div className="flex justify-between items-start">
              <span className="font-medium text-gray-900">Thành phần:</span>
              <span className="text-gray-700 ml-2 text-right max-w-xs">
                {material.composition}
              </span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Cảnh báo:</strong> Việc xóa chất liệu này có thể ảnh hưởng
              đến các sản phẩm đang sử dụng chất liệu này. Hãy chắc chắn rằng
              không có sản phẩm nào đang sử dụng trước khi xóa.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Xóa chất liệu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
