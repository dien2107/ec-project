import { MapPin, Phone, Edit, Trash2, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import type { Address } from "~/types/address/address";

const AddressCard = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (address: Address) => void;
}) => {
  return (
    <div className="p-3 border-b-1">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <MapPin size={18} className="text-gray-400 flex-shrink-0" />

          <div className="flex flex-col gap-1 py-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-md truncate">
                {address.recipientName}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-sm text-gray-600 hidden-sm:inline">
                {address.phone}
              </span>
              {address.isDefault && (
                <Badge variant="default" className="ml-2 text-xs">
                  <Check size={12} />
                  Mặc định
                </Badge>
              )}
            </div>

            <div className="text-sm text-gray-500 truncate max-w-[60vw] sm:max-w-[40vw]">
              {address.streetAddress}
            </div>
            <div className="text-sm text-gray-500 truncate max-w-[60vw] sm:max-w-[40vw]">
              {address.ward.name}, {address.province.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!address.isDefault && (
            <Button
              variant="ghost"
              className="cursor-pointer text-xs text-gray-600 hover:text-black px-2 py-1 rounded-md border border-gray-200"
              onClick={() => onSetDefault(address)}
            >
              Đặt mặc định
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(address)}
            className="h-8 w-8 p-0"
          >
            <Edit size={14} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(address)}
            className={`h-8 w-8 p-0 text-red-500 hover:text-red-600 ${address.isDefault ? "hidden" : "s"}`}
            disabled={address.isDefault}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default AddressCard;
