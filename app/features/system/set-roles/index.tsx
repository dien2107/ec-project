"use client";

import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import DataTable from "~/features/system/components/data-table";
import { UserModal } from "~/features/system/set-roles/components/user-modal";

// Kiểu dữ liệu User
export interface User {
  id?: number;
  name: string;
  email: string;
  roles: string[];
  status: "active" | "inactive" | "banned"; // ✅ thêm trạng thái
}

// Dữ liệu mẫu ban đầu
const initialUsers: User[] = [
  { id: 1, name: "Nguyễn Văn A", email: "a@example.com", roles: ["Admin", "Manager"], status: "active" },
  { id: 2, name: "Trần Thị B", email: "b@example.com", roles: ["Staff", "Editor"], status: "inactive" },
  { id: 3, name: "Lê Văn C", email: "c@example.com", roles: ["Viewer", "Editor"], status: "banned" },
];

export default function UserPermissionSystem() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Giả lập fetch dữ liệu từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await new Promise<User[]>((resolve) =>
          setTimeout(() => resolve(initialUsers), 1000)
        );
        setUsers(response);
      } catch (error) {
        alert("Lỗi khi tải dữ liệu người dùng.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Mở modal
  const handleOpenModal = (user: User | null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Lưu user sau khi thêm / sửa
  const handleSaveUser = (user: User) => {
    // Ensure status is always a valid value
    const validStatus: User["status"][] = ["active", "inactive", "banned"];
    const safeUser: User = {
      ...user,
      status: validStatus.includes(user.status as User["status"])
        ? (user.status as User["status"])
        : "active",
    };

    if (safeUser.id) {
      // Cập nhật user
      setUsers((prev) => prev.map((u) => (u.id === safeUser.id ? safeUser : u)));
      alert(`Đã cập nhật nhân viên ${safeUser.name}.`);
    } else {
      // Thêm user mới
      const newUser = {
        ...safeUser,
        id: users.length > 0 ? Math.max(...users.map((u) => u.id!)) + 1 : 1,
      };
      setUsers((prev) => [...prev, newUser]);
      alert(`Đã thêm nhân viên ${safeUser.name}.`);
    }
    setIsModalOpen(false);
  };

// Cột bảng
const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center">Tên nhân viên</div>,
    size: 150,
    cell: ({ row }) => (
      <div className="text-center">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center">Email</div>,
    size: 200,
    cell: ({ row }) => (
      <div className="text-center">{row.original.email}</div>
    ),
  },
  {
    accessorKey: "roles",
    header: () => <div className="text-center">Quyền</div>,
    size: 200,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 justify-center">
        {row.original.roles.map((role, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-sm rounded-full text-gray-700"
          >
            {role}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Trạng thái</div>,
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status;
      const statusConfig = {
        active: { label: "Hoạt động", color: "bg-green-100 text-green-700" },
        inactive: { label: "Ngưng", color: "bg-yellow-100 text-yellow-700" },
        banned: { label: "Cấm", color: "bg-red-100 text-red-700" },
      } as const;
      return (
        <div className="flex justify-center">
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${statusConfig[status].color}`}
          >
            {statusConfig[status].label}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    size: 80,
    cell: ({ row }) => (
      <div className="flex justify-center gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleOpenModal(row.original);
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

  // Phân trang
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý người dùng & phân quyền</h2>
        <Button onClick={() => handleOpenModal(null)}>+ Thêm nhân viên</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-slate-500">Đang tải dữ liệu...</p>
        </div>
      ) : paginatedUsers.length > 0 ? (
        <DataTable<User, unknown>
          columns={columns}
          data={paginatedUsers}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => setCurrentPage(page)}
          title="Danh sách người dùng"
        />
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
          <p className="text-slate-500">Không có người dùng nào trong danh sách.</p>
        </div>
      )}

      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
}
