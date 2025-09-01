import React from "react";

interface DeleteSupplierDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onDelete: () => void;
  supplierName?: string;
}

export default function DeleteSupplierDialog({ open, setIsOpen, onDelete, supplierName }: DeleteSupplierDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div className="bg-white p-6 rounded-[10px] shadow w-full max-w-md relative">
        <h2 className="text-lg font-bold mb-4">Xóa nhà cung cấp</h2>
        <p>Bạn có chắc chắn muốn xóa nhà cung cấp <b>{supplierName}</b> không?</p>
        <div className="flex gap-2 mt-6 justify-end">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsOpen(false)}>Hủy</button>
          <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={onDelete}>Xóa</button>
        </div>
      </div>
    </div>
  );
}
