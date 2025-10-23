import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { Address } from "./types/address";
import { mockData } from "./data";
import AddressForm from "./components/address-form";
import AddressCard from "./components/address-card";
import Pagination from "./components/pagination";
import DeleteAddressDialog from "./components/delete-category";

const AddressManagement = () => {
  const [addresses, setAddresses] = useState<Address[]>(mockData);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    city: "",
  });

  const totalPages = Math.ceil(addresses.length / pageSize);
  const paginatedAddresses = addresses.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const resetForm = () => {
    setFormData({ name: "", phone: "", address: "", district: "", city: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setSelectedAddress(null);
    resetForm();
    setIsAddOpen(true);
  };

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setFormData({
      name: address.name,
      phone: address.phone,
      address: address.address,
      district: address.district,
      city: address.city,
    });
    setIsEditOpen(true);
  };

  const handleDelete = (address: Address) => {
    setSelectedAddress(address);
    setIsDeleteOpen(true);
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.district ||
      !formData.city
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (selectedAddress) {
      // Update existing address
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === selectedAddress.id ? { ...addr, ...formData } : addr
        )
      );
      setIsEditOpen(false);
    } else {
      // Add new address
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
        createdDate: new Date().toLocaleDateString("vi-VN"),
      };
      setAddresses((prev) => [...prev, newAddress]);
      setIsAddOpen(false);
    }

    resetForm();
    setSelectedAddress(null);
  };

  const handleCancel = () => {
    if (selectedAddress) {
      setIsEditOpen(false);
    } else {
      setIsAddOpen(false);
    }
    resetForm();
    setSelectedAddress(null);
  };

  const setAsDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const confirmDelete = () => {
    if (selectedAddress) {
      // Không cho phép xóa nếu chỉ còn 1 địa chỉ
      if (addresses.length <= 1) {
        alert("Không thể xóa địa chỉ cuối cùng!");
        setIsDeleteOpen(false);
        setSelectedAddress(null);
        return;
      }

      setAddresses((prev) => {
        const remainingAddresses = prev.filter(
          (addr) => addr.id !== selectedAddress.id
        );

        // Nếu địa chỉ bị xóa là mặc định và còn lại addresses khác
        // thì tự động đặt address đầu tiên làm mặc định
        if (selectedAddress.isDefault && remainingAddresses.length > 0) {
          remainingAddresses[0].isDefault = true;
        }

        // Nếu chỉ còn 1 địa chỉ thì tự động đặt làm mặc định
        if (remainingAddresses.length === 1) {
          remainingAddresses[0].isDefault = true;
        }

        return remainingAddresses;
      });

      setIsDeleteOpen(false);
      setSelectedAddress(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 min-h-[70vh]  bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Quản lý địa chỉ
          </h1>
          <p className="text-gray-500">Quản lý địa chỉ giao hàng của bạn</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAdd}
              className="ml-auto bg-[#3770EC] text-white cursor-pointer"
            >
              <Plus />
              Thêm sản phẩm
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Thêm địa chỉ mới</DialogTitle>
            </DialogHeader>
            <AddressForm
              formData={formData}
              onInputChange={handleInputChange}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Address List (stacked single-line items) */}
      <div className="flex flex-col gap-4">
        {paginatedAddresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSetDefault={setAsDefault}
            canDelete={addresses.length > 1}
          />
        ))}
      </div>

      {/* Pagination */}
      {addresses.length > pageSize && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={addresses.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa địa chỉ</DialogTitle>
          </DialogHeader>
          <AddressForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isEdit
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <DeleteAddressDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        address={selectedAddress}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default AddressManagement;
