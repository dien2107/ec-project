import instance from "./customize-axios";

export const postUserData = async (data: any) => {
  try {
    const response = await instance.post("/users", data);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};
export const getUserById = async (userId: number) => {
  try {
    const response = await instance.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
export const updateUserById = async (userId: number, data: any) => {
  try {
    const response = await instance.put(`/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateProfileUserById = async (userId: number, data: any) => {
  try {
    const response = await instance.put(`/users/profile/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
export const postUserAssignRoles = async (
  params: { userId: number; AssignedBy: number },
  RoleIds: number[]
) => {
  try {
    const response = await instance.post(`/users/assign-roles`, RoleIds, {
      params: {
        userId: params.userId,
        assignedBy: params.AssignedBy,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning roles to user:", error);
    throw error;
  }
};
export const changeUserPassword = async (FormData: FormData) => {
  try {
    const response = await instance.post(`/users/change-password`, FormData);
    return response.data;
  } catch (error) {
    console.error("Error changing user password:", error);
    throw error;
  }
};
export const getUserBySelf = async () => {
  try {
    const response = await instance.get(`/users/me`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by self:", error);
    throw error;
  }
};
export const uploadUserAvatar = async (FormData: FormData) => {
  try {
    const response = await instance.patch(
      `/users/upload-avatar-image`,
      FormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading user avatar:", error);
    throw error;
  }
};
export const deleteUserAvatar = async () => {
  try {
    const response = await instance.delete(`/users/delete-avatar-image`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user avatar:", error);
    throw error;
  }
};
