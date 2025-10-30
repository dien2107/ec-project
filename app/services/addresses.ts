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

export const createAddress = async (data: AddressFormData) => {
  try {
    console.log(data)
    const response = await instance.post(`/addresses/me`, data);
    return response.data;
  } catch (error) {
    console.error("Error fetching wards by province ID:", error);
    throw error;
  }
};

export const updateAddress = async (
  addressId: number,
  data: AddressFormData
) => {
  try {
    console.log(data);
    const response = await instance.patch(
      `/addresses/me/address/${addressId}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

export const deleteAddress = async (addressId: number) => {
  try {
    const response = await instance.delete(
      `/addresses/me/address/${addressId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};

export const setDefaultAddress = async (addressId: number) => {
  try {
    const response = await instance.patch(
      `/addresses/me/address/${addressId}/set-default`
    );
    return response.data;
  } catch (error) {
    console.error("Error setting default address:", error);
    throw error;
  }
};
