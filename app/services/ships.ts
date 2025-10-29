import instance from "./customize-axios";
import type { ShippingFormData } from "~/features/system/shipping/types/shipping-form-data";

export const createShipping = async (data: ShippingFormData) => {
  try {
    const response = await instance.post("/ships", data);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const deleteShipping = async (shipId: number) => {
  try {
    const response = await instance.delete(`/ships/${shipId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting shipping method:", error);
    throw error;
  }
};
export const updateShipping = async (
  shipId: number,
  data: ShippingFormData
) => {
  try {
    const response = await instance.put(`/ships/${shipId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating shipping method:", error);
    throw error;
  }
};

export const setShippingActiveStatus = async (shipId: number) => {
  try {
    const response = await instance.patch(`/ships/${shipId}/activate`);
    return response.data;
  } catch (error) {
    console.error("Error toggling shipping method status:", error);
    throw error;
  }
};
