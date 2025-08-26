import React from "react";

interface UserInfoEditProps {
  name: string;
  email: string;
  phone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function UserInfoEdit({ name, email, phone, onChange, onSave, onClose }: UserInfoEditProps) {
  return (
<div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Chỉnh sửa thông tin cá nhân</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">×</button>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm mb-1" htmlFor="name">Họ và tên</label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={onChange}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="phone">Số điện thoại</label>
            <input
              id="phone"
              name="phone"
              value={phone}
              onChange={onChange}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Hủy</button>
            <button type="submit" className="px-4 py-2 rounded bg-gray-400 text-black">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
}
