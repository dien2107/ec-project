"use client";

import React, { useState } from "react";
import { Users, Shield, Settings, ChevronRight, Check, Plus, Edit2, Trash2, X, ChevronDown } from "lucide-react";

// Kiểu dữ liệu cho từng row (mỗi chức năng)
type Permission = {
  feature: string;
  TruyCap: boolean;
  ThemMoi: boolean;
  Sua: boolean;
  Xoa: boolean;
  Duyet: boolean;
  ThanhToan: boolean;
  XemTatCa: boolean;
};

// Kiểu dữ liệu cho nhóm người dùng
type UserGroup = {
  id: string;
  name: string;
  level: number;
  isActive: boolean;
  memberCount: number;
  permissions: Permission[];
};

// Props cho CustomCheckbox
type CustomCheckboxProps = {
  checked: boolean;
  onCheckedChange: () => void;
  label?: string;
};

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// Add/Edit Group Modal
const GroupModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  group?: UserGroup | null;
  onSave: (groupData: Partial<UserGroup>) => void;
  mode: 'add' | 'edit';
}> = ({ isOpen, onClose, group, onSave, mode }) => {
  const [formData, setFormData] = useState({
    name: group?.name || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  React.useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
      });
    } else {
      setFormData({
        name: '',
      });
    }
    setErrors({});
  }, [group, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên nhóm không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        id: group?.id || `group-${Date.now()}`,
        isActive: group?.isActive || false,
        permissions: group?.permissions || []
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Thêm nhóm mới' : 'Chỉnh sửa nhóm'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên nhóm *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Nhập tên nhóm..."
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors hover:bg-gray-50 rounded-lg"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-sm hover:shadow-md"
          >
            {mode === 'add' ? 'Thêm nhóm' : 'Cập nhật'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Delete Confirmation Modal
const DeleteConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
}> = ({ isOpen, onClose, onConfirm, groupName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Xóa nhóm quyền
        </h2>
        
        <p className="text-gray-600 mb-6">
          Bạn có chắc chắn muốn xóa nhóm <span className="font-medium text-gray-900">"{groupName}"</span>? 
          Hành động này không thể hoàn tác.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors hover:bg-gray-50 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
          >
            Xóa nhóm
          </button>
        </div>
      </div>
    </Modal>
  );
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onCheckedChange, label }) => (
  <div className="flex items-center justify-center">
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onCheckedChange}
        className="sr-only"
      />
      <div
        onClick={onCheckedChange}
        className={`
          w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center
          ${checked 
            ? 'bg-blue-600 border-blue-600 shadow-sm' 
            : 'bg-white border-gray-300 hover:border-blue-400'
          }
        `}
      >
        {checked && (
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        )}
      </div>
    </div>
    {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
  </div>
);

// PermissionRow Component - Expandable row cho mỗi resource/feature
const PermissionRow: React.FC<{
  permission: Permission;
  index: number;
  isExpanded: boolean;
  onToggleExpand: (index: number) => void;
  onTogglePermission: (index: number, key: keyof Permission) => void;
}> = ({ permission, index, isExpanded, onToggleExpand, onTogglePermission }) => {
  type PermissionKey = Exclude<keyof Permission, 'feature'>;
  const permissionKeys: PermissionKey[] = [
    'TruyCap', 'ThemMoi', 'Sua', 'Xoa', 'Duyet', 'ThanhToan', 'XemTatCa'
  ];
  const labels: Record<PermissionKey, string> = {
    TruyCap: 'Truy cập',
    ThemMoi: 'Thêm mới',
    Sua: 'Sửa',
    Xoa: 'Xóa',
    Duyet: 'Duyệt',
    ThanhToan: 'Thanh toán',
    XemTatCa: 'Xem tất cả'
  };

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* Resource header */}
      <div 
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onToggleExpand(index)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium text-gray-900">{permission.feature}</span>
        </div>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Expanded permissions */}
      {isExpanded && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {permissionKeys.map((key) => (
              <div key={key as string} className="flex items-center space-x-2">
                <CustomCheckbox
                  checked={permission[key]}
                  onCheckedChange={() => onTogglePermission(index, key)}
                  label={labels[key]}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PermissionManagement: React.FC = () => {
  // Danh sách các chức năng với icons
  const features = [
    "Quản lý phòng ban",
    "Quản lý người dùng",
    "Quản lý file",
    "Quản lý Inbox", 
    "Quản lý công việc",
    "Quản lý quyền",
    "Email Marketing",
    "SMS Marketing",
    "Automation",
  ];

  // Danh sách các nhóm người dùng với thông tin chi tiết
  const [userGroups, setUserGroups] = useState<UserGroup[]>([
    {
      id: "admin",
      name: "Nhóm Admin",
      level: 0,
      isActive: true,
      memberCount: 3,
      permissions: features.map((f) => ({
        feature: f,
        TruyCap: true,
        ThemMoi: true,
        Sua: true,
        Xoa: true,
        Duyet: true,
        ThanhToan: true,
        XemTatCa: true,
      })),
    },
    {
      id: "business",
      name: "Nhóm kinh doanh",
      level: 0,
      isActive: false,
      memberCount: 12,
      permissions: features.map((f) => ({
        feature: f,
        TruyCap: f.includes("kinh doanh") || f.includes("Inbox"),
        ThemMoi: f.includes("kinh doanh"),
        Sua: false,
        Xoa: false,
        Duyet: false,
        ThanhToan: false,
        XemTatCa: f.includes("kinh doanh"),
      })),
    },
    {
      id: "business-manager",
      name: "Nhóm quản lý kinh doanh",
      level: 0,
      isActive: false,
      memberCount: 5,
      permissions: features.map((f) => ({
        feature: f,
        TruyCap: f.includes("kinh doanh") || f.includes("Inbox") || f.includes("công việc"),
        ThemMoi: f.includes("kinh doanh") || f.includes("công việc"),
        Sua: f.includes("kinh doanh"),
        Xoa: false,
        Duyet: f.includes("kinh doanh"),
        ThanhToan: false,
        XemTatCa: f.includes("kinh doanh") || f.includes("công việc"),
      })),
    },
    {
      id: "marketing",
      name: "Nhóm marketing",
      level: 0,
      isActive: false,
      memberCount: 8,
      permissions: features.map((f) => ({
        feature: f,
        TruyCap: f.includes("Marketing") || f.includes("Automation"),
        ThemMoi: f.includes("Marketing"),
        Sua: f.includes("Marketing"),
        Xoa: false,
        Duyet: false,
        ThanhToan: false,
        XemTatCa: f.includes("Marketing"),
      })),
    },
    {
      id: "warehouse",
      name: "Nhóm kho vận",
      level: 0,
      isActive: false,
      memberCount: 6,
      permissions: features.map((f) => ({
        feature: f,
        TruyCap: f.includes("file") || f.includes("công việc"),
        ThemMoi: f.includes("file"),
        Sua: f.includes("file"),
        Xoa: false,
        Duyet: false,
        ThanhToan: false,
        XemTatCa: false,
      })),
    },
    {
      id: "accounting",
      name: "Nhóm kế toán",
      level: 0,
      isActive: false,
      memberCount: 4,
      permissions: features.map((f) => ({
        feature: f,
        TruyCap: f.includes("ThanhToan") || f.includes("file"),
        ThemMoi: false,
        Sua: false,
        Xoa: false,
        Duyet: false,
        ThanhToan: true,
        XemTatCa: f.includes("ThanhToan"),
      })),
    },
    {
      id: "technical",
      name: "Nhóm kỹ thuật",
      level: 0,
      isActive: false,
      memberCount: 7,
      permissions: features.map((f) => ({
        feature: f,
        TruyCap: f.includes("file") || f.includes("Automation") || f.includes("quyền"),
        ThemMoi: f.includes("file") || f.includes("Automation"),
        Sua: f.includes("file") || f.includes("Automation"),
        Xoa: f.includes("file"),
        Duyet: false,
        ThanhToan: false,
        XemTatCa: f.includes("file") || f.includes("Automation"),
      })),
    },
    {
      id: "hr",
      name: "Nhóm hành chính - nhân sự",
      level: 0,
      isActive: false,
      memberCount: 3,
      permissions: features.map((f) => ({
        feature: f,
        TruyCap: f.includes("người dùng") || f.includes("phòng ban"),
        ThemMoi: f.includes("người dùng") || f.includes("phòng ban"),
        Sua: f.includes("người dùng") || f.includes("phòng ban"),
        Xoa: false,
        Duyet: f.includes("người dùng"),
        ThanhToan: false,
        XemTatCa: f.includes("người dùng") || f.includes("phòng ban"),
      })),
    },
  ]);

  const [activeGroup, setActiveGroup] = useState("admin");
  const [data, setData] = useState<Permission[]>(
    userGroups.find((g) => g.id === activeGroup)?.permissions || []
  );

  // State cho expanded rows
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([0])); // Mở rộng row đầu tiên mặc định

  // Modal states
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedGroup, setSelectedGroup] = useState<UserGroup | null>(null);

  // Chuyển đổi nhóm
  const handleGroupChange = (groupId: string) => {
    setActiveGroup(groupId);
    const group = userGroups.find((g) => g.id === groupId);
    if (group) {
      setData([...group.permissions]);
      // Reset expanded rows khi chuyển group
      setExpandedRows(new Set([0]));
    }
  };

  // Toggle checkbox
  const toggle = (rowIndex: number, key: keyof Permission) => {
    setData((prev) =>
      prev.map((row, i) =>
        i === rowIndex ? { ...row, [key]: !row[key] } : row
      )
    );
  };

  // Toggle expand row
  const toggleExpand = (rowIndex: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowIndex)) {
        newSet.delete(rowIndex);
      } else {
        newSet.add(rowIndex);
      }
      return newSet;
    });
  };

  // Group management functions
  const handleAddGroup = () => {
    setModalMode('add');
    setSelectedGroup(null);
    setShowGroupModal(true);
  };

  const handleEditGroup = (group: UserGroup) => {
    setModalMode('edit');
    setSelectedGroup(group);
    setShowGroupModal(true);
  };

  const handleDeleteGroup = (group: UserGroup) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const handleSaveGroup = (groupData: Partial<UserGroup>) => {
    if (modalMode === 'add') {
      const newGroup: UserGroup = {
        ...groupData as UserGroup,
        permissions: features.map((f) => ({
          feature: f,
          TruyCap: false,
          ThemMoi: false,
          Sua: false,
          Xoa: false,
          Duyet: false,
          ThanhToan: false,
          XemTatCa: false,
        })),
      };
      setUserGroups(prev => [...prev, newGroup]);
    } else if (selectedGroup) {
      setUserGroups(prev => 
        prev.map(group => 
          group.id === selectedGroup.id 
            ? { ...group, ...groupData }
            : group
        )
      );
    }
  };

  const handleConfirmDelete = () => {
    if (selectedGroup) {
      setUserGroups(prev => prev.filter(group => group.id !== selectedGroup.id));
      
      // If deleting active group, switch to first available group
      if (selectedGroup.id === activeGroup) {
        const remainingGroups = userGroups.filter(g => g.id !== selectedGroup.id);
        if (remainingGroups.length > 0) {
          handleGroupChange(remainingGroups[0].id);
        }
      }
    }
  };

  const activeGroupData = userGroups.find((g) => g.id === activeGroup);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex gap-6 p-6">
        {/* Sidebar nhóm */}
        <div className="w-80">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Nhóm người dùng</h2>
                    <p className="text-blue-100 text-sm">Quản lý phân quyền hệ thống</p>
                  </div>
                </div>
                
                <button
                  onClick={handleAddGroup}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Thêm nhóm mới"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-2">
                {userGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`
                      group relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300
                      ${group.level === 1 ? "ml-6 border-l-2 border-gray-200" : ""}
                      ${
                        activeGroup === group.id
                          ? "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 shadow-md"
                          : "hover:bg-gray-50 hover:shadow-sm border border-transparent"
                      }
                    `}
                  >
                    <div 
                      onClick={() => handleGroupChange(group.id)}
                      className="flex items-center gap-4 w-full"
                    >
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`
                            font-medium truncate transition-colors duration-200
                            ${activeGroup === group.id ? "text-blue-800" : "text-gray-900"}
                          `}>
                            {group.name}
                          </h3>
                          {activeGroup === group.id && (
                            <ChevronRight className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${activeGroup === group.id 
                              ? "bg-blue-200 text-blue-800" 
                              : "bg-gray-200 text-gray-600"
                            }
                          `}>
                            {group.memberCount} thành viên
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons - only show on hover or active */}
                    <div className={`
                      absolute right-2 top-2 flex gap-1 transition-opacity duration-200
                      ${activeGroup === group.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
                    `}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGroup(group);
                        }}
                        className="p-1.5 hover:bg-blue-200 rounded-md transition-colors"
                        title="Chỉnh sửa nhóm"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                      
                      {group.id !== 'admin' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group);
                          }}
                          className="p-1.5 hover:bg-red-200 rounded-md transition-colors"
                          title="Xóa nhóm"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </button>
                      )}
                    </div>

                    {activeGroup === group.id && (
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bảng phân quyền */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl">
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Phân quyền hệ thống
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <span>Nhóm:</span>
                      <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                        {activeGroupData?.name}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>{activeGroupData?.memberCount} thành viên</span>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
            
            <div className="p-6">
              {/* Custom Permission Table với expandable rows */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="divide-y divide-gray-200">
                  {data.map((permission, index) => (
                    <PermissionRow
                      key={index}
                      permission={permission}
                      index={index}
                      isExpanded={expandedRows.has(index)}
                      onToggleExpand={toggleExpand}
                      onTogglePermission={toggle}
                    />
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}
                </div>
                
                <div className="flex gap-3">
                  <button className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-all hover:bg-gray-50 rounded-lg">
                    Hủy bỏ
                  </button>
                  <button className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-sm hover:shadow-md">
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <GroupModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        group={selectedGroup}
        onSave={handleSaveGroup}
        mode={modalMode}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        groupName={selectedGroup?.name || ''}
      />
    </div>
  );
};

export default PermissionManagement;