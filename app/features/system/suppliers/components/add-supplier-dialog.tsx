import React from "react";

interface AddSupplierDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AddSupplierDialog({ open, setIsOpen }: AddSupplierDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div className="bg-white p-6 rounded-[10px] shadow w-full max-w-2xl relative">
        <h2 className="text-xl font-bold mb-6">Thêm nhà cung cấp</h2>
        <button className="absolute top-2 right-2 text-gray-400 hover:text-black" onClick={() => setIsOpen(false)}>&times;</button>
        <form className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Tên nhà cung cấp</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Nhập tên nhà cung cấp" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Liên hệ</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Nhập thông tin liên hệ" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Thông tin</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Nhập thông tin" />
          </div>
        </form>
        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setIsOpen(false)} type="button">Hủy</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Thêm nhà cung cấp</button>
        </div>
      </div>
    </div>
  );
}
