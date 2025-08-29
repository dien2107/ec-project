import * as React from "react";
import type { ImportOrder } from "../types";

interface DeleteModalProps {
  open: boolean;
  order: ImportOrder | null;
  onClose: () => void;
  onDelete: (order: ImportOrder) => void;
}

export function DeleteImportOrderModal({ open, order, onClose, onDelete }: DeleteModalProps) {
  if (!open || !order) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h4 className="font-bold text-lg mb-4">Xoá đơn nhập hàng</h4>
        <p>Bạn có chắc chắn muốn xoá đơn <b>{order.id}</b> không?</p>
        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Huỷ</button>
          <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={() => onDelete(order)}>Xoá</button>
        </div>
      </div>
    </div>
  );
}
