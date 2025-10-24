import type { AddressFormData } from "~/features/clients/address/types/address";
import instance from "./customize-axios";

export const getWardsByProvinceId = async (provinceId: number) => {
  try {
    const response = await instance.get(`/wards/province/${provinceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching wards by province ID:", error);
    throw error;
  }
};

export const createAddress = async (userId: number, data: AddressFormData) => {
  try {
    const response = await instance.post(`/addresses/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching wards by province ID:", error);
    throw error;
  }
};

export const updateAddress = async (
  userId: number,
  addressId: number,
  data: AddressFormData
) => {
  try {
    const response = await instance.patch(
      `/addresses/${userId}/address/${addressId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

export const deleteAddress = async (userId: number, addressId: number) => {
  try {
    const response = await instance.delete(
      `/addresses/${userId}/address/${addressId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};

export const setDefaultAddress = async (userId: number, addressId: number) => {
  try {
    const response = await instance.patch(
      `/addresses/${userId}/address/${addressId}/set-default`
    );
    return response.data;
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};
