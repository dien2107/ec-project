// src/features/user-profile/user-info.tsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserInfoView from "../components/user-info/user-info-view";
import UserInfoEdit from "../components/user-info/user-info-edit";
import type { RootState } from "~/redux/store";
import { set } from "date-fns";

export default function UserInfo() {
  const load = useSelector((state: RootState) => state.auth.user);
  const user = load?.data ?? null;
  const [editOpen, setEditOpen] = useState(false);
  console.log("UserInfo render with user:", user);
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-gray-500">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  const handleEdit = () => setEditOpen(true);
  const handleClose = () => setEditOpen(false);
  const handleSuccess = () => {
    setEditOpen(false);
  };

  return (
    <>
      <UserInfoView user={user} onEdit={handleEdit} />

      <UserInfoEdit
        user={user}
        open={editOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </>
  );
}