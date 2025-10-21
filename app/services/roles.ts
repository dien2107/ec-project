import instance from "./customize-axios";

export const postRolePermissions = async (
  roleId: number,
  permissionIds: number[]
) => {
  try {
    const response = await instance.post(
      `/roles/${roleId}/permissions`,
      permissionIds
    );
    return response.data;
  } catch (error) {
    console.error("Error updating role permissions:", error);
    throw error;
  }
};
export const postRole = async (formData: FormData) => {
  try {
    const response = await instance.post(`/roles`, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};
export const deleteRoleById = async (roleId: number) => {
  try {
    const response = await instance.delete(`/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting role:", error);
    throw error;
  }
};
export const updateRoleById = async (roleId: number, formData: FormData) => {
  try {
    const response = await instance.put(`/roles/${roleId}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error updating role:", error);
    throw error;
  }
};
