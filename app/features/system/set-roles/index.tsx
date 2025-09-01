"use client"

import React, { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "~/components/ui/button"
import DataTable from "~/features/system/components/data-table"
import { UserModal } from "~/features/system/set-roles/components/user-modal"

export interface User {
  id?: number
  name: string
  email: string
  role: string
  status: "active" | "inactive"
}

const initialUsers: User[] = [
  { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "Admin", status: "active" },
  { id: 2, name: "Trần Thị B", email: "b@example.com", role: "Manager", status: "inactive" },
  { id: 3, name: "Lê Văn C", email: "c@example.com", role: "Staff", status: "active" },
]

export default function UserPermissionSystem() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (user: User | null) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSaveUser = (user: User) => {
    if (user.id) {
      // Cập nhật user
      setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)))
    } else {
      // Thêm user mới
      setUsers((prev) => [...prev, { ...user, id: prev.length + 1 }])
    }
  }

  const handleDeleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Tên nhân viên",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Vai trò",
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <span
          className={
            row.original.status === "active"
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          {row.original.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation()
              handleOpenModal(row.original)
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation()
              if (row.original.id !== undefined) {
                handleDeleteUser(row.original.id)
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý người dùng & phân quyền</h2>
        <Button onClick={() => handleOpenModal(null)}>+ Thêm nhân viên</Button>
      </div>

      <DataTable<User, unknown>
        columns={columns}
        data={users}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        title="Danh sách người dùng"
      />

      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  )
}
