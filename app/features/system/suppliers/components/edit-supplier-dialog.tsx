import React from "react";
import type { Supplier } from "../types";

interface EditSupplierDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  supplier: Supplier | null;
}

export default function EditSupplierDialog({ open, setIsOpen, supplier }: EditSupplierDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div className="bg-white p-6 rounded-[10px] shadow w-full max-w-2xl relative">
        <h2 className="text-xl font-bold mb-6">Sửa nhà cung cấp</h2>
        <button className="absolute top-2 right-2 text-gray-400 hover:text-black cursor-pointer" onClick={() => setIsOpen(false)}>&times;</button>
        <form className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Tên nhà cung cấp</label>
            <input className="w-full border rounded px-3 py-2 disabled:bg-gray-100" defaultValue={supplier?.name} placeholder="Nhập tên nhà cung cấp" disabled />
          </div>
          <div>
            <label className="block mb-1 font-medium">Liên hệ</label>
            <input className="w-full border rounded px-3 py-2" defaultValue={supplier?.contact} placeholder="Nhập thông tin liên hệ" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Thông tin</label>
            <input className="w-full border rounded px-3 py-2" defaultValue={supplier?.info} placeholder="Nhập thông tin" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Trạng thái</label>
            <select className="w-full border rounded px-3 py-2" defaultValue={supplier?.status}>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
        </form>
        <div className="flex justify-end gap-2 mt-6">
          <button className="px-4 py-2 bg-gray-200 rounded cursor-pointer" onClick={() => setIsOpen(false)} type="button">Hủy</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer" type="submit">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
}
