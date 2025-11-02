import React from "react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";

interface CartHeaderProps {
  itemsCount: number;
  isAllSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onClearSelected: () => void;
  selectedCount: number;
}

const CartHeader: React.FC<CartHeaderProps> = ({
  itemsCount,
  isAllSelected,
  onSelectAll,
  onClearSelected,
  selectedCount,
}) => {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Checkbox checked={isAllSelected} onCheckedChange={onSelectAll} />
        <span className="text-sm">Chọn tất cả ({itemsCount})</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-red-500 hover:text-red-600"
        onClick={onClearSelected}
        disabled={selectedCount === 0}
      >
        Xóa
      </Button>
    </div>
  );
};

export default CartHeader;
