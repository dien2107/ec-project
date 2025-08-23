import React from "react";

interface UserInfoViewProps {
  name: string;
  email: string;
  phone: string;
  onEdit: () => void;
}

export default function UserInfoView({ name, email, phone, onEdit }: UserInfoViewProps) {
  return (
    <div className="flex-1">
      <div className="p-6 flex flex-col gap-4 rounded-xl shadow border border-gray-100">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-lg">Thông tin cá nhân</div>
          <button
            type="button"
            className="border px-3 py-1 rounded text-sm hover:bg-gray-100 hover:text-black transition"
            onClick={onEdit}
          >
            Chỉnh sửa thông tin
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-500 text-sm mb-1">Họ và tên:</div>
            <div className="font-medium">{name}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Email:</div>
            <div className="font-medium">{email}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Số điện thoại:</div>
            <div className="font-medium">{phone}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
