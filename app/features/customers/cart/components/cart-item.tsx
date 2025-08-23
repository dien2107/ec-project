import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Minus, Plus, Trash2 } from "./icon";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    image: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    selected: boolean;
  };
  onSelectItem: (id: string, checked: boolean) => void;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemoveItem: (id: string) => void;
}

const CartItem = ({
  item,
  onSelectItem,
  onQuantityChange,
  onRemoveItem,
}: CartItemProps) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + "₫";
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4">
        {/* Checkbox */}
        <Checkbox
          checked={item.selected}
          onCheckedChange={checked => {
            console.log("onCheckedChange triggered:", checked);
            onSelectItem(item.id, !!checked);
          }}
          onClick={() => console.log("Checkbox clicked")} // Test này
          className="border-gray-400 flex-shrink-0"
        />
        {/* <input
          type="checkbox"
          checked={item.selected}
          onChange={e => onSelectItem(item.id, e.target.checked)}
          className="w-4 h-4 rounded border-2 border-gray-400 flex-shrink-0"
        /> */}

        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yOCAzNkw0MCAyNEw1MiAzNlY1Nkg0MFY0NEgzMlY1NkgyOFYzNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm md:text-base truncate">
            {item.name}
          </h3>
          <div className="text-sm text-gray-500 mt-1">
            Size: {item.size} | Màu: {item.color}
          </div>
          <div className="font-semibold mt-2">{formatPrice(item.price)}</div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus size={14} />
          </Button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            className="w-8 h-8 p-0"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          >
            <Plus size={14} />
          </Button>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-red-500 p-2 flex-shrink-0"
          onClick={() => onRemoveItem(item.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
