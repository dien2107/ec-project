import { MapPin, MapPinCheck, Edit, Trash2, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import type { Address } from "~/types/address/address";

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  variant = "default",
  showBasicActions = true,
  selectedAddress,
  onSelectAddress,
  selectedId,
  onSelectAddressId,
}: {
  address: Address;
  onEdit?: (address: Address, closeView?: () => void) => void;
  onDelete?: (address: Address, closeView?: () => void) => void;
  onSetDefault?: (address: Address) => void;
  variant?: "default" | "payment";
  showBasicActions?: boolean;
  selectedAddress?: Address | null;
  onSelectAddress?: (address: Address) => void;
  selectedId?: string | null;
  onSelectAddressId?: (id: string) => void;
}) => {
  const isSelected =
    (selectedId ? selectedId === String(address.addressId) : false) ||
    (!!selectedAddress && selectedAddress.addressId === address.addressId);

  return (
    <div
      className={`p-2 lg:p-3 border-b-1 ${variant === "payment" && "flex-1"} `}
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2 lg:gap-3">
        <div className="flex items-start lg:items-center gap-3 min-w-0">
          {isSelected ? (
            <MapPinCheck size={18} className="text-black flex-shrink-0" />
          ) : (
            <MapPin size={18} className="text-gray-400 flex-shrink-0" />
          )}

          <div className="flex flex-col gap-1 py-1 lg:py-2 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate text-sm lg:text-md">
                {address.recipientName}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-sm text-gray-600 hidden md:inline">
                {address.phone}
              </span>
              {address.isDefault && (
                <Badge variant="default" className="ml-2 text-xs">
                  <Check size={12} />
                  Mặc định
                </Badge>
              )}
            </div>

            <div className="text-sm text-gray-500 truncate max-w-full md:max-w-[60vw] lg:max-w-[40vw]">
              {address.streetAddress}
            </div>
            <div className="text-sm text-gray-500 truncate max-w-full md:max-w-[60vw] lg:max-w-[40vw]">
              {address.ward.name}, {address.province.name}
            </div>
          </div>
        </div>

        {showBasicActions && (
          <div className="flex items-center gap-2 mt-2 lg:mt-0 w-full lg:w-auto justify-end">
            {!address.isDefault && (
              <Button
                variant="ghost"
                className="cursor-pointer text-xs text-gray-600 hover:text-black px-2 py-1 rounded-md border border-gray-200 w-28 md:w-32 lg:w-auto flex-shrink-0"
                onClick={() => onSetDefault?.(address)}
              >
                Đặt mặc định
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(address)}
              className="h-8 w-8 p-0"
            >
              <Edit size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(address)}
              className={`h-8 w-8 p-0 text-red-500 hover:text-red-600 ${address.isDefault ? "hidden" : ""}`}
              disabled={address.isDefault}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default AddressCard;
