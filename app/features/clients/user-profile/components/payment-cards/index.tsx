import React, { useState } from "react";
import type { PaymentCard } from "./types";
import { mockPaymentCards } from "./data/mockPaymentCards";
import AddCardModal from "./components/add-card-modal";
import EditCardModal from "./components/edit-card-modal";
import DeleteCardModal from "./components/delete-card-modal";
import { Button } from "~/components/ui/button";
import { Edit, Trash, Plus, Check } from "lucide-react";
import { Badge } from "~/components/ui/badge";

export default function PaymentCards() {
  const [cards, setCards] = useState<PaymentCard[]>(mockPaymentCards);
  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleAdd = (card: PaymentCard) => {
    setCards((prev) => [
      { ...card, id: `CARD-${Date.now().toString().slice(-3)}` },
      ...prev,
    ]);
    setIsAddOpen(false);
  };

  const handleEdit = (card: PaymentCard) => {
    setSelectedCard(card);
    setIsEditOpen(true);
  };

  const handleEditSave = (card: PaymentCard) => {
    setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
    setIsEditOpen(false);
    setSelectedCard(null);
  };

  const handleDelete = (card: PaymentCard) => {
    setSelectedCard(card);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCard) {
      setCards((prev) => prev.filter((c) => c.id !== selectedCard.id));
      setIsDeleteOpen(false);
      setSelectedCard(null);
    }
  };

  return (
    <div className="bg-white min-h-[70vh] rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Thẻ ngân hàng của bạn
        </h1>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 text-white flex items-center gap-2"
        >
          <Plus />
          Thêm thẻ mới
        </Button>
      </div>
      <div className="space-y-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`flex items-center justify-between p-3 border-b-1`}
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="font-semibold text-lg flex items-center gap-2">
                  {card.brand}
                  {card.isDefault && (
                    <Badge
                      variant="default"
                      className="text-white ml-2 text-xs"
                    >
                      <Check size={12} />
                      Mặc định
                    </Badge>
                  )}
                </span>
                <span className="font-mono text-base tracking-widest">
                  {card.cardNumber}
                </span>
                <span className="text-gray-500 text-sm">{card.cardHolder}</span>
                <span className="text-gray-500 text-sm">
                  Hết hạn: {card.expiry}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="p-2"
                onClick={() => handleEdit(card)}
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                className="p-2 text-red-600"
                onClick={() => handleDelete(card)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AddCardModal
        open={isAddOpen}
        setIsOpen={setIsAddOpen}
        onAdd={handleAdd}
      />
      <EditCardModal
        open={isEditOpen}
        setIsOpen={setIsEditOpen}
        card={selectedCard}
        onSave={handleEditSave}
      />
      <DeleteCardModal
        open={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        onDelete={handleDeleteConfirm}
        cardNumber={selectedCard?.cardNumber}
      />
    </div>
  );
}
