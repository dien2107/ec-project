import React from "react";

interface DeleteColorDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  onDelete: () => void;
  colorName?: string;
}

export default function DeleteColorDialog({ 
  open, 
  setIsOpen, 
  onDelete, 
  colorName 
}: DeleteColorDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-[10px] p-6 w-full max-w-md shadow-lg">
        <h4 className="font-bold text-lg mb-4">Xác nhận xóa</h4>
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa màu sắc <strong>"{colorName}"</strong>? 
          Hành động này không thể hoàn tác.
        </p>
        
        <div className="flex justify-end gap-2">
          <button 
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300" 
            onClick={() => setIsOpen(false)}
          >
            Hủy
          </button>
          <button 
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700" 
            onClick={onDelete}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}