import { useState } from "react";
import { Button } from "~/components/ui/button";
import NewAddressSheet from "~/features/clients/payment/components/new-address";
import type { Address } from "~/features/clients/payment/types/payment";

export default function AddressSection({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
}: {
  addresses: Address[];
  selectedAddressId: string;
  onSelectAddress: (id: string) => void;
  onAddAddress: (address: Address) => void;
}) {
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);

  return (
    <div className="border rounded-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Địa chỉ giao hàng</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddressSheetOpen(true)}
        >
          + Thêm địa chỉ mới
        </Button>
      </div>
      <div className="space-y-3">
        {addresses.map((a) => (
          <div
            key={a.id}
            className={`border rounded-lg p-4 cursor-pointer ${
              selectedAddressId === a.id
                ? "border-primary bg-primary/5"
                : "border-gray-200"
            }`}
            onClick={() => onSelectAddress(a.id)}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                checked={selectedAddressId === a.id}
                onChange={() => onSelectAddress(a.id)}
              />
              <span className="font-medium">{a.fullName}</span>
              {a.isDefault && (
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                  Mặc định
                </span>
              )}
            </div>
            <div className="pl-6 text-sm text-gray-600 mt-2">
              <div>{a.phone}</div>
              <div>
                {a.address}, {a.city}
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewAddressSheet
        open={isAddressSheetOpen}
        onOpenChange={setIsAddressSheetOpen}
        onSubmit={onAddAddress}
      />
    </div>
  );
}
