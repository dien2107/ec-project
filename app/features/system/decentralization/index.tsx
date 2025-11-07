"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  Shield,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  Check,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchPermissionListData } from "~/redux/slices/permissions";
import { fetchRoleListData } from "~/redux/slices/roles";
import {
  postRole,
  postRolePermissions,
  deleteRoleById,
  updateRoleById,
} from "~/services/roles";
import toast, { Toaster } from "react-hot-toast";

type Permission = {
  permissionId: number;
  permissionName: string;
  description: string;
};
export type PermissionList = {
  resourceId: number;
  resourceName: string;
  resourceDescription: string;
  permissions: Permission[];
};
export type RoleList = {
  roleId: number;
  name: string;
  description: string;
  status: {
    statusId: number;
    name: string;
    displayName: string;
    entityType: string;
  };
  permissionIds: number[];
};

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

const GroupModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  group?: RoleList | null;
  onSave: (groupData: Partial<RoleList>) => void;
  mode: "add" | "edit";
  loading: boolean;
}> = ({ isOpen, onClose, group, onSave, mode, loading }) => {
  const [formData, setFormData] = useState({
    name: group?.name || "",
    description: group?.description || "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
      });
    }
    setErrors({});
  }, [group, isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = "Tên nhóm không được để trống";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        roleId: group?.roleId,
        status: group?.status || {
          statusId: 66,
          name: "Active",
          displayName: "Hoạt động",
          entityType: "Role",
        },
        permissionIds: group?.permissionIds || [],
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "add" ? "Thêm nhóm mới" : "Chỉnh sửa nhóm"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
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
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, name: e.target.value }));
            }}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.name ? "border-red-300" : "border-gray-300"
            }`}
            placeholder="Nhập tên nhóm..."
            disabled={loading}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả nhóm
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="w-full px-4 py-2.5 border rounded-lg border-gray-300"
            placeholder="Nhập mô tả nhóm..."
            disabled={loading}
          />
        </div>
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors hover:bg-gray-50 rounded-lg"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-sm hover:shadow-md"
            disabled={loading}
          >
            {mode === "add" ? "Thêm nhóm" : "Cập nhật"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const DeleteConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  groupName: string;
  loading: boolean;
}> = ({ isOpen, onClose, onConfirm, groupName, loading }) => {
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
          Bạn có chắc chắn muốn xóa nhóm{" "}
          <span className="font-medium text-gray-900">"{groupName}"</span>? Hành
          động này không thể hoàn tác.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors hover:bg-gray-50 rounded-lg"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={() => {
              if (!loading) {
                onConfirm();
                onClose();
              }
            }}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            disabled={loading}
          >
            Xóa nhóm
          </button>
        </div>
      </div>
    </Modal>
  );
};

const CustomCheckbox: React.FC<{
  checked: boolean;
  onCheckedChange: () => void;
  label?: string;
}> = ({ checked, onCheckedChange, label }) => (
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
          ${
            checked
              ? "bg-blue-600 border-blue-600 shadow-sm"
              : "bg-white border-gray-300 hover:border-blue-400"
          }
        `}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </div>
    </div>
    {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
  </div>
);

const PermissionManagement: React.FC = () => {
  const dispatch = useAppDispatch();

  const { permissionList, isLoading: isPermissionLoading } = useAppSelector(
    (state) => state.permissionList
  );
  const { roleList, isLoading: isRoleLoading } = useAppSelector(
    (state) => state.roleList
  );

  const [activeRoleId, setActiveRoleId] = useState<number | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>(
    []
  );
  const [loadingGroup, setLoadingGroup] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  // Get data arrays directly from API response
  const rolesArray = roleList?.data || [];
  const permissionsArray = permissionList?.data || [];

  useEffect(() => {
    if (!activeRoleId && rolesArray.length > 0) {
      setActiveRoleId(rolesArray[0].roleId);
    }
  }, [roleList, activeRoleId]);

  useEffect(() => {
    const activeRole = rolesArray.find(
      (r: RoleList) => r.roleId === activeRoleId
    );
    setSelectedPermissionIds(activeRole?.permissionIds ?? []);
  }, [activeRoleId, roleList]);

  useEffect(() => {
    dispatch(fetchPermissionListData());
    dispatch(fetchRoleListData({}));
  }, [dispatch]);

  const activeRole = rolesArray.find(
    (r: RoleList) => r.roleId === activeRoleId
  );

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedGroup, setSelectedGroup] = useState<RoleList | null>(null);

  const handleAddGroup = () => {
    setModalMode("add");
    setSelectedGroup(null);
    setShowGroupModal(true);
  };

  const handleEditGroup = (group: RoleList) => {
    setModalMode("edit");
    setSelectedGroup(group);
    setShowGroupModal(true);
  };

  const handleDeleteGroup = (group: RoleList) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const handleSaveGroup = async (groupData: Partial<RoleList>) => {
    if (loadingGroup) return;
    setLoadingGroup(true);
    toast.remove("role-success");
    toast.remove("role-error");
    try {
      const formData = new FormData();
      formData.append("name", groupData.name ?? "");
      formData.append("description", groupData.description ?? "");
      formData.append("statusId", String(groupData.status?.statusId ?? 66));
      if (modalMode === "add") {
        await postRole(formData);
        toast.success("Thêm nhóm quyền thành công!", { id: "role-success" });
      } else if (modalMode === "edit" && groupData.roleId) {
        await updateRoleById(groupData.roleId, formData);
        toast.success("Cập nhật nhóm quyền thành công!", {
          id: "role-success",
        });
      }
      setShowGroupModal(false);
      dispatch(fetchRoleListData({}));
    } catch (error) {
      toast.error("Có lỗi xảy ra khi lưu nhóm quyền!", { id: "role-error" });
    } finally {
      setLoadingGroup(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedGroup || loadingDelete) return;
    setLoadingDelete(true);
    toast.remove("role-success");
    toast.remove("role-error");
    try {
      await deleteRoleById(selectedGroup.roleId);
      toast.success("Xóa nhóm quyền thành công!", { id: "role-success" });
      setShowDeleteModal(false);
      dispatch(fetchRoleListData({}));
      if (activeRoleId === selectedGroup.roleId) setActiveRoleId(null);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa nhóm quyền!", { id: "role-error" });
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleTogglePermission = (permId: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  const handleSavePermissions = async () => {
    if (!activeRoleId || loadingPermissions) return;
    setLoadingPermissions(true);
    toast.remove("role-success");
    toast.remove("role-error");
    try {
      await postRolePermissions(activeRoleId, selectedPermissionIds);
      toast.success("Cập nhật quyền cho nhóm thành công!", {
        id: "role-success",
      });
      dispatch(fetchRoleListData({}));
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật quyền!", { id: "role-error" });
    } finally {
      setLoadingPermissions(false);
    }
  };

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([0]));
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

  const PermissionRow: React.FC<{
    resource: PermissionList;
    index: number;
    isExpanded: boolean;
  }> = ({ resource, index, isExpanded }) => (
    <div className="border-b border-gray-200 last:border-b-0">
      {/* Resource header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => toggleExpand(index)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium text-gray-900">
            {resource.resourceDescription}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </div>
      {/* Expanded permissions */}
      {isExpanded && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {resource.permissions.map((perm) => (
              <div
                key={perm.permissionId}
                className="flex items-center space-x-2"
              >
                <CustomCheckbox
                  checked={selectedPermissionIds.includes(perm.permissionId)}
                  onCheckedChange={() =>
                    handleTogglePermission(perm.permissionId)
                  }
                  label={perm.description}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex gap-6 p-6">
          {/* Sidebar nhóm quyền */}
          <div className="w-80">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Nhóm quyền</h2>
                    <p className="text-blue-100 text-sm">
                      Quản lý phân quyền hệ thống
                    </p>
                  </div>
                </div>
                {/* <button
                  onClick={handleAddGroup}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Thêm nhóm mới"
                  disabled={loadingGroup}
                >
                  <Plus className="w-5 h-5" />
                </button> */}
              </div>
              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {isRoleLoading ? (
                  <div>Đang tải nhóm quyền...</div>
                ) : rolesArray.length > 0 ? (
                  rolesArray.map((group: RoleList) => (
                    <div
                      key={group.roleId}
                      className={`group relative flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300
                        ${
                          activeRoleId === group.roleId
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 shadow-md"
                            : "hover:bg-gray-50 hover:shadow-sm border border-transparent"
                        }
                      `}
                    >
                      <div
                        onClick={() => setActiveRoleId(group.roleId)}
                        className="flex items-center gap-4 w-full"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3
                              className={`font-medium truncate transition-colors duration-200
                              ${activeRoleId === group.roleId ? "text-blue-800" : "text-gray-900"}`}
                            >
                              {group.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={`text-xs px-2 py-1 rounded-full
                              ${
                                activeRoleId === group.roleId
                                  ? "bg-blue-200 text-blue-800"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {group.status.displayName}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Action buttons */}
                      <div
                        className={`absolute right-2 top-2 flex gap-1 transition-opacity duration-200
                        ${activeRoleId === group.roleId ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditGroup(group);
                          }}
                          className="p-1.5 hover:bg-blue-200 rounded-md transition-colors"
                          title="Chỉnh sửa nhóm"
                          disabled={loadingGroup}
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGroup(group);
                          }}
                          className="p-1.5 hover:bg-red-200 rounded-md transition-colors"
                          title="Xóa nhóm"
                          disabled={loadingDelete}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" />
                        </button>
                      </div>
                      {activeRoleId === group.roleId && (
                        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>Không có dữ liệu nhóm quyền</div>
                )}
              </div>
            </div>
          </div>
          {/* Bảng quyền */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Phân quyền hệ thống
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <span>Nhóm:</span>
                  <span className="font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {activeRole?.name || "Chưa chọn nhóm"}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>{activeRole?.description || "Không có mô tả"}</span>
                </div>
              </div>
              <div className="p-6">
                {isPermissionLoading ? (
                  <div>Đang tải danh sách quyền...</div>
                ) : permissionsArray.length > 0 ? (
                  permissionsArray.map(
                    (resource: PermissionList, idx: number) => (
                      <PermissionRow
                        key={resource.resourceId}
                        resource={resource}
                        index={idx}
                        isExpanded={expandedRows.has(idx)}
                      />
                    )
                  )
                ) : (
                  <div>Không có dữ liệu quyền</div>
                )}
                {/* Action buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-all hover:bg-gray-50 rounded-lg"
                      disabled={loadingPermissions}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-all shadow-sm hover:shadow-md"
                      onClick={handleSavePermissions}
                      disabled={loadingPermissions}
                    >
                      {loadingPermissions ? "Đang lưu..." : "Lưu thay đổi"}
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
          loading={loadingGroup}
        />
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          groupName={selectedGroup?.name || ""}
          loading={loadingDelete}
        />
      </div>
    </>
  );
};

export default PermissionManagement;
