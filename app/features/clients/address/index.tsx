import { useEffect, useState } from "react";

import { fetchAddressesByUserId } from "~/redux/slices/addresses";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { setDefaultAddress } from "~/services/addresses";
import type { Address } from "~/types/address/address";
import AddAddressForm from "./components/add-address-form";
import AddressCard from "./components/address-card";
import DeleteAddressDialog from "./components/delete-address-form";
import EditAddressForm from "./components/edit-address-form";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

const AddressManagement = () => {
  const dispatch = useAppDispatch();
  const { addresses = [], isLoading } = useAppSelector(
    (state) => state.addresses
  );
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    // Giả sử userId là 1, thay đổi theo logic thực tế của bạn
    if ((addresses?.length ?? 0) === 0) {
      dispatch(fetchAddressesByUserId(1));
    }
    // we include addresses.length so if addresses change from undefined->[] we still fetch once
  }, [dispatch, addresses.length]);

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsEditOpen(true);
  };

  const handleDelete = (address: Address) => {
    setSelectedAddress(address);
    setIsDeleteOpen(true);
  };

  const handleSetAsDefault = async (address: Address) => {
    try {
      await setDefaultAddress(1, address.addressId);
      dispatch(fetchAddressesByUserId(1));
      toast.success("Đã đặt địa chỉ mặc định thành công!");
    } catch (error: any) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có lỗi xảy ra khi đặt địa chỉ mặc định!");
      }
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
        <AddAddressForm
          onAdded={() => {
            dispatch(fetchAddressesByUserId(1));
          }}
        />
      </div>

      {/* Address List (stacked single-line items) */}
      <div className="flex flex-col gap-4">
        {addresses.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <span className="text-gray-500">Không có địa chỉ nào</span>
          </div>
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address.addressId}
              address={address}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSetDefault={handleSetAsDefault}
            />
          ))
        )}
      </div>

      {/* Edit Dialog */}
      {selectedAddress && (
        <EditAddressForm
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          selectedAddress={selectedAddress}
          onUpdated={() => {
            dispatch(fetchAddressesByUserId(1));
          }}
        />
      )}

      {/* Delete Dialog */}
      {selectedAddress && (
        <DeleteAddressDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          selectedAddress={selectedAddress}
          onDeleted={() => {
            dispatch(fetchAddressesByUserId(1));
          }}
        />
      )}
    </div>
  );
};

export default AddressManagement;
