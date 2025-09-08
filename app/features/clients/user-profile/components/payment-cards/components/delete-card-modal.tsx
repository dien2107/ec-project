import React from "react";

interface DeleteCardModalProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onDelete: () => void;
  cardNumber?: string;
}

export default function DeleteCardModal({ open, setIsOpen, onDelete, cardNumber }: DeleteCardModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h4 className="font-bold text-lg mb-4">Xác nhận xóa thẻ</h4>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa thẻ <strong>•••• {cardNumber?.slice(-4)}</strong>? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={() => setIsOpen(false)}>Hủy</button>
          <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={onDelete}>Xóa</button>
        </div>
      </div>
    </div>
  );
}