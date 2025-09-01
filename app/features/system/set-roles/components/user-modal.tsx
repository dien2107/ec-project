"use client"

import React, { useEffect, useState } from "react"
import { AlertDialogFooter, AlertDialogHeader } from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"

interface User {
  id?: number
  name: string
  email: string
  role: string
  status: "active" | "inactive"
}

interface UserModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
  onSave: (user: User) => void
}

export const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [form, setForm] = useState<User>({
    id: undefined,
    name: "",
    email: "",
    role: "",
    status: "active",
  })

  useEffect(() => {
    if (user) {
      setForm(user)
    } else {
      setForm({ id: undefined, name: "", email: "", role: "", status: "active" })
    }
  }, [user])

  const handleChange = (key: keyof User, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.role) {
      alert("Vui lòng nhập đầy đủ thông tin")
      return
    }
    onSave(form)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <AlertDialogHeader>
          <DialogTitle>{form.id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div>
            <label className="block text-sm mb-1">Tên</label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập tên nhân viên"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Vai trò</label>
            <Input
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
              placeholder="Nhập vai trò (VD: Admin, Manager, Staff)"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Trạng thái</label>
            <Select value={form.status} onValueChange={(value) => handleChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>
            Lưu
          </Button>
        </AlertDialogFooter>
      </DialogContent>
    </Dialog>
  )
}
