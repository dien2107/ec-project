import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import type { Address } from "~/types/address/address";
import AddressCard from "~/features/clients/address/components/address-card";
import { toast } from "react-hot-toast";
import { setDefaultAddress } from "~/services/addresses";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { fetchAddressesByUserId } from "~/redux/slices/addresses";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export default function ViewAddressesDialog({
  selectedId,
  onSelectAddressId,
  onEdit,
  onDelete,
  onOpenAdd,
  externalOpen,
  setExternalOpen,
}: {
  selectedId?: string | null;
  onSelectAddressId?: (id: string) => void;
  onEdit?: (address: Address, closeView?: () => void) => void;
  onDelete?: (address: Address, closeView?: () => void) => void;
  onOpenAdd?: () => void;
  externalOpen?: boolean;
  setExternalOpen?: (open: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const { addresses = [], isLoading } = useAppSelector(
    (state) => state.addresses
  );
  const [open, setOpen] = useState(false);
  const actualOpen = externalOpen ?? open;
  const actualSetOpen = setExternalOpen ?? setOpen;
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(
    selectedId ?? null
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if ((addresses?.length ?? 0) === 0) {
      dispatch(fetchAddressesByUserId(user.data.userId));
    }
  }, [dispatch, addresses.length]);

  useEffect(() => {
    setLocalSelectedId(selectedId ?? null);
  }, [selectedId]);

  const handleSelect = (address: Address) => {
    const id = String(address.addressId);
    setLocalSelectedId(id);
  };

  const handleSetAsDefault = async (address: Address) => {
    try {
      await setDefaultAddress(address.addressId);
      await dispatch(fetchAddressesByUserId(user.data.userId));
      const id = String(address.addressId);
      // setLocalSelectedId(id);
      // onSelectAddressId?.(id);
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
    <>
      <Dialog open={actualOpen} onOpenChange={actualSetOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={() => actualSetOpen(true)}
            disabled={isLoading}
          >
            Thay đổi
          </Button>
        </DialogTrigger>

        <DialogContent
          className={
            // base (mobile/tablet): fluid, centered and compact; lg (desktop) keeps original fixed size
            "w-[90vw] max-w-[90vw] md:max-w-[85vw] lg:min-w-[600px] lg:max-w-[600px] rounded-lg shadow-lg p-4 sm:p-6"
          }
        >
          <DialogHeader>
            <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
          </DialogHeader>

          <div className="max-h-[60vh] lg:max-h-[500px] overflow-y-auto scrollbar-custom space-y-3 pr-2">
            {addresses.length === 0 ? (
              <>
                <div className="py-6 text-center text-sm text-gray-500">
                  Không có địa chỉ
                </div>
                <div className="mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      actualSetOpen(false);
                      onOpenAdd?.();
                    }}
                  >
                    Thêm địa chỉ
                  </Button>
                </div>
              </>
            ) : (
              <>
                <RadioGroup
                  value={localSelectedId ?? ""}
                  onValueChange={(val) => {
                    const found = addresses.find(
                      (a) => String(a.addressId) === val
                    );
                    if (found) handleSelect(found);
                  }}
                >
                  {addresses.map((a) => (
                    <div
                      key={a.addressId}
                      // base: mobile/tablet spacing and rounded card look; lg: revert to original (no extra padding)
                      className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-md lg:p-0 lg:rounded-none"
                    >
                      {/* native radio for accessibility, visually hidden */}
                      <RadioGroupItem
                        id={`address-${a.addressId}`}
                        value={String(a.addressId)}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`address-${a.addressId}`}
                        className="flex-1 cursor-pointer"
                      >
                        <AddressCard
                          address={a}
                          onEdit={(addr) =>
                            // use actualSetOpen so we close the dialog regardless of controlled/uncontrolled mode
                            onEdit?.(addr, () => actualSetOpen(false))
                          }
                          onDelete={(addr) =>
                            onDelete?.(addr, () => actualSetOpen(false))
                          }
                          onSetDefault={handleSetAsDefault}
                          variant="payment"
                          selectedId={localSelectedId}
                        />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {addresses.length <= 4 && (
                  <div className="mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        actualSetOpen(false);
                        onOpenAdd?.();
                      }}
                    >
                      Thêm địa chỉ
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <Button variant="outline" onClick={() => actualSetOpen(false)}>
              Đóng
            </Button>
            <Button
              variant="add"
              onClick={() => {
                const found = addresses.find(
                  (a) => String(a.addressId) === (localSelectedId ?? "")
                );
                if (found) {
                  onSelectAddressId?.(String(found.addressId));
                  actualSetOpen(false);
                }
              }}
              disabled={!localSelectedId}
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
