import { useEffect, useMemo, useState } from "react";
import EditAddressForm from "~/features/clients/address/components/edit-address-form";
import DeleteAddressDialog from "~/features/clients/address/components/delete-address-form";
import AddAddressForm from "~/features/clients/address/components/add-address-form";
import AddressCard from "~/features/clients/address/components/address-card";
import ViewAddressesDialog from "./view-addresses-dialog";
import type { Address } from "~/types/address/address";
import { fetchAddressesByUserId } from "~/redux/slices/addresses";
import { useAppDispatch, useAppSelector } from "~/redux/store";

export default function AddressSection({
  selectedAddress,
  onSelectAddress,
}: {
  selectedAddress: Address | null;
  onSelectAddress: (address: Address | null) => void;
}) {
  const dispatch = useAppDispatch();
  const { addresses = [] } = useAppSelector(state => state.addresses);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<Address | null>(null);
  const [reopenViewAfterEdit, setReopenViewAfterEdit] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Fetch địa chỉ nếu chưa có
  useEffect(() => {
    if ((addresses?.length ?? 0) === 0) {
      dispatch(fetchAddressesByUserId(1));
    }
  }, [dispatch, addresses.length]);

  // Lấy địa chỉ mặc định nếu chưa có selectedAddress
  const defaultAddress = useMemo(
    () => addresses.find(a => a.isDefault) || null,
    [addresses]
  );

  useEffect(() => {
    if (!selectedAddress && defaultAddress) {
      onSelectAddress(defaultAddress);
    }
  }, [selectedAddress, defaultAddress, onSelectAddress]);

  return (
    <>
      <div className="border rounded-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Địa chỉ giao hàng</h2>
          {/* Button to open view addresses dialog (moved here from AddressCard) */}
          <div>
            <ViewAddressesDialog
              externalOpen={isViewOpen}
              setExternalOpen={setIsViewOpen}
              selectedId={
                selectedAddress?.addressId
                  ? String(selectedAddress.addressId)
                  : null
              }
              onSelectAddressId={id => {
                const found =
                  addresses.find(a => String(a.addressId) === id) ?? null;
                onSelectAddress(found);
              }}
              onOpenAdd={() => {
                setIsViewOpen(false);
                setReopenViewAfterEdit(true);
                setIsAddOpen(true);
              }}
              onEdit={(addr, closeView) => {
                setEditingAddress(addr ?? selectedAddress);
                setIsEditOpen(true);
                setReopenViewAfterEdit(!!closeView);
                closeView?.();
              }}
              onDelete={(addr, closeView) => {
                setDeletingAddress(addr ?? selectedAddress);
                setIsDeleteOpen(true);
                setReopenViewAfterEdit(!!closeView);
                closeView?.();
              }}
            />
          </div>
        </div>

        {selectedAddress && (
          <AddressCard
            address={selectedAddress}
            onEdit={(addr, closeView) => {
              setEditingAddress(selectedAddress);
              setIsEditOpen(true);
              setReopenViewAfterEdit(!!closeView);
              closeView?.();
            }}
            onDelete={(addr, closeView) => {
              setDeletingAddress(selectedAddress);
              setIsDeleteOpen(true);
              closeView?.();
            }}
            onSetDefault={() => {}}
            variant="payment"
            showBasicActions={false}
            selectedId={
              selectedAddress.addressId
                ? String(selectedAddress.addressId)
                : null
            }
            onSelectAddressId={id => {
              const found =
                addresses.find(a => String(a.addressId) === id) ?? null;
              onSelectAddress(found);
            }}
          />
        )}
      </div>

      {/* Edit dialog moved here from view-addresses-dialog */}
      {editingAddress && (
        <EditAddressForm
          open={isEditOpen}
          setIsOpen={setIsEditOpen}
          selectedAddress={editingAddress}
          onUpdated={() => {
            dispatch(fetchAddressesByUserId(1));
            setIsEditOpen(false);
            if (reopenViewAfterEdit) {
              setIsViewOpen(true);
              setReopenViewAfterEdit(false);
            }
          }}
          onCancel={() => {
            setIsEditOpen(false);
            if (reopenViewAfterEdit) {
              setIsViewOpen(true);
              setReopenViewAfterEdit(false);
            }
          }}
        />
      )}

      {/* Delete dialog moved here from view-addresses-dialog */}
      {deletingAddress && (
        <DeleteAddressDialog
          open={isDeleteOpen}
          setIsOpen={setIsDeleteOpen}
          selectedAddress={deletingAddress}
          onDeleted={() => {
            dispatch(fetchAddressesByUserId(1));
            setIsDeleteOpen(false);
            if (reopenViewAfterEdit) {
              setIsViewOpen(true);
              setReopenViewAfterEdit(false);
            }
          }}
          onCancel={() => {
            setIsDeleteOpen(false);
            if (reopenViewAfterEdit) {
              setIsViewOpen(true);
              setReopenViewAfterEdit(false);
            }
          }}
        />
      )}

      {/* Add dialog moved here from view-addresses-dialog */}
      <AddAddressForm
        open={isAddOpen}
        setIsOpen={setIsAddOpen}
        showAddButton={false}
        onAdded={() => {
          dispatch(fetchAddressesByUserId(1));
          setIsAddOpen(false);
          if (reopenViewAfterEdit) {
            setIsViewOpen(true);
            setReopenViewAfterEdit(false);
          }
        }}
        onCancel={() => {
          setIsAddOpen(false);
          if (reopenViewAfterEdit) {
            setIsViewOpen(true);
            setReopenViewAfterEdit(false);
          }
        }}
      />
    </>
  );
}
