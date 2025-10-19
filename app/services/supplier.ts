import type { UpdateSupplierRequest } from "~/features/system/suppliers/types/update-supplier";
import instance from "./customize-axios";

export const createSupplier = async (formData: FormData) => {
    try { 
        const response = await instance.post("/suppliers", formData);
        return response.data;
    } catch (error) {
        console.error("Error creating supplier:", error);
        throw error;
    }
};

export const updateSupplier = async (supplierId: number, data: UpdateSupplierRequest) => {
    try {
        const response = await instance.put(`/suppliers/${supplierId}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating supplier:", error);
        throw error;
    }
};

export const updateSupplierStatus = async (supplierId: number, statusId: number) => {
    try {
        const response = await instance.put(`/suppliers/${supplierId}/status/${statusId}`); 
        return response.data;
    } catch (error) {
        console.error("Error updating supplier status:", error);
        throw error;
    }       
};

export const deleteSupplier = async (supplierId: number) => {
    try {
        const response = await instance.delete(`/suppliers/${supplierId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting supplier:", error);
        throw error;
    }
};
export const getSupplierById = async (supplierId: number) => {
    try {
        const response = await instance.get(`/suppliers/${supplierId}`);    
        return response.data;
    } catch (error) {
        console.error("Error fetching supplier by ID:", error);
        throw error;
    }
};