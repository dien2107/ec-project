import React, { useState, useEffect } from "react";
import type { Color } from "../types";

interface EditColorDialogProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  color: Color | null;
  onSave: (color: Color) => void;
}

export default function EditColorDialog({ open, setIsOpen, color, onSave }: EditColorDialogProps) {
  const [form, setForm] = useState<Color>({
    id: "",
    name: "",
    hexCode: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    if (open && color) {
      setForm(color);
    }
  }, [open, color]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.hexCode) {
      onSave(form);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-[10px] p-6 w-full max-w-md shadow-lg">
        <h4 className="font-bold text-lg mb-4">Sửa màu sắc</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên màu</label>
              <input
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Nhập tên màu"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mã màu</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  value={form.hexCode || "#000000"}
                  onChange={e => setForm({ ...form, hexCode: e.target.value })}
                />
                <input
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-md font-mono text-sm"
                  value={form.hexCode}
                  onChange={e => setForm({ ...form, hexCode: e.target.value })}
                  placeholder="#000000"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Mô tả</label>
            <textarea
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Nhập mô tả màu sắc"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              className="w-full border border-gray-300 px-3 py-2 rounded-md"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as "active" | "inactive" })}
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Ngưng hoạt động</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button 
              type="button"
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300" 
              onClick={() => setIsOpen(false)}
            >
              Hủy
            </button>
            <button 
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}