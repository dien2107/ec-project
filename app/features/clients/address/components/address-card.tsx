// components/AddressCard.tsx
import React from "react";
import { MapPin, Phone, Edit, Trash2, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { type AddressCardProps } from "../types/address";

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  canDelete,
}) => {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{address.name}</h3>
              {address.isDefault && (
                <Badge variant="default" className="gap-1">
                  <Check size={12} />
                  Mặc định
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} />
              <span className="text-sm">{address.phone}</span>
            </div>
          </div>
          <div className="flex gap-1">
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
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              disabled={!canDelete}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed">
              {address.address}, {address.district}, {address.city}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-gray-500">
              Tạo ngày: {address.createdDate}
            </span>
            {!address.isDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetDefault(address.id)}
                className="text-xs"
              >
                Đặt làm mặc định
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default AddressCard;
