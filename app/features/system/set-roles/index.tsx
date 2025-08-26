import { useState } from "react";
import {
  Users,
  Shield,
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";

// ===== Types =====
interface Permission {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissionIds: number[];
}

interface User {
  id: number;
  name: string;
  email: string;
  roleIds: number[];
  status: "active" | "inactive";
}

// ===== Dummy permissions =====
const permissions: Permission[] = [
  { id: 1, name: "Quản lý phòng ban" },
  { id: 2, name: "Quản lý nhân viên" },
  { id: 3, name: "Quản lý file" },
  { id: 4, name: "Quản lý Inbox" },
  { id: 5, name: "Quản lý công việc" },
  { id: 6, name: "Quản lý quyền" },
  { id: 7, name: "Email Marketing" },
  { id: 8, name: "SMS Marketing" },
  { id: 9, name: "Automation" },
];

// ===== User Modal =====
interface UserModalProps {
  user: User | null;
  roles: Role[];
  onSave: (user: Omit<User, "id"> | User) => void;
  onClose: () => void;
}

const UserModal = ({ user, roles, onSave, onClose }: UserModalProps) => {
  const [formData, setFormData] = useState<Omit<User, "id">>(
    user
      ? { name: user.name, email: user.email, roleIds: user.roleIds, status: user.status }
      : { name: "", email: "", roleIds: [], status: "active" }
  );

  const handleRoleToggle = (roleId: number) => {
    setFormData((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user ? { ...formData, id: user.id } : formData);
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {user ? "Sửa nhân viên" : "Thêm nhân viên"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Họ tên</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, status: e.target.value as "active" | "inactive" }))
              }
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm khóa</option>
            </select>
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium mb-2">Nhóm quyền</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {roles.map((role) => (
                <label key={role.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.roleIds.includes(role.id)}
                    onChange={() => handleRoleToggle(role.id)}
                  />
                  <span className="text-sm">{role.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Save size={16} />
              <span>Lưu</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ===== Main Component =====
const UserPermissionSystem = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Nguyễn Văn A", email: "a@company.com", roleIds: [1, 2], status: "active" },
    { id: 2, name: "Trần Thị B", email: "b@company.com", roleIds: [2], status: "active" },
    { id: 3, name: "Lê Văn C", email: "c@company.com", roleIds: [3], status: "inactive" },
  ]);

  const [roles, setRoles] = useState<Role[]>([
    { id: 1, name: "Admin", description: "Quản trị hệ thống", permissionIds: [1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 2, name: "Manager", description: "Quản lý", permissionIds: [2, 3, 4, 5, 6] },
    { id: 3, name: "Staff", description: "Nhân viên", permissionIds: [5, 6] },
  ]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Helpers
  const getRoleName = (roleId: number) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : "Unknown";
  };

  // Save user
  const handleSaveUser = (userData: Omit<User, "id"> | User) => {
    if ("id" in userData) {
      setUsers((prev) => prev.map((u) => (u.id === userData.id ? userData : u)));
    } else {
      setUsers((prev) => [...prev, { ...userData, id: Date.now() }]);
    }
    setShowUserModal(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Quản lý phân quyền</h1>

      {/* Users */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Quản lý nhân viên</h2>
          <button
            onClick={() => {
              setEditingUser(null);
              setShowUserModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus size={16} />
            <span>Thêm nhân viên</span>
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium">nhân viên</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Nhóm quyền</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {u.roleIds.map((rid) => (
                      <span key={rid} className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {getRoleName(rid)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      u.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.status === "active" ? "Hoạt động" : "Tạm khóa"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setShowUserModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showUserModal && (
        <UserModal
          user={editingUser}
          roles={roles}
          onSave={handleSaveUser}
          onClose={() => setShowUserModal(false)}
        />
      )}
    </div>
  );
};

export default UserPermissionSystem;
