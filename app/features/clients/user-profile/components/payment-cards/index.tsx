import React, { useState } from "react";
import type { PaymentCard } from "./types";
import { mockPaymentCards } from "./data/mockPaymentCards";
import AddCardModal from "./components/add-card-modal";
import EditCardModal from "./components/edit-card-modal";
import DeleteCardModal from "./components/delete-card-modal";

export default function PaymentCards() {
  const [cards, setCards] = useState<PaymentCard[]>(mockPaymentCards);
  const [selectedCard, setSelectedCard] = useState<PaymentCard | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleAdd = (card: PaymentCard) => {
    setCards(prev => [
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
    setCards(prev => prev.map(c => c.id === card.id ? card : c));
    setIsEditOpen(false);
    setSelectedCard(null);
  };

  const handleDelete = (card: PaymentCard) => {
    setSelectedCard(card);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCard) {
      setCards(prev => prev.filter(c => c.id !== selectedCard.id));
      setIsDeleteOpen(false);
      setSelectedCard(null);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Thẻ ngân hàng của bạn</h3>
        <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={() => setIsAddOpen(true)}
        >
          <span className="text-lg">+</span>
          Thêm thẻ mới
        </button>
      </div>
      <div className="space-y-4">
        {cards.map(card => (
          <div key={card.id} className={`flex items-center justify-between border rounded-lg px-4 py-3 ${card.isDefault ? 'border-blue-600' : 'border-gray-200'}`}>
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="font-semibold text-lg">{card.brand}</span>
                <span className="font-mono text-base tracking-widest">{card.cardNumber}</span>
                <span className="text-gray-500 text-sm">{card.cardHolder}</span>
                <span className="text-gray-500 text-sm">Hết hạn: {card.expiry}</span>
                {card.isDefault && <span className="text-blue-600 text-xs font-medium mt-1">Mặc định</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200" onClick={() => handleEdit(card)}>
                Sửa
              </button>
              <button className="px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200" onClick={() => handleDelete(card)}>
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <AddCardModal open={isAddOpen} setIsOpen={setIsAddOpen} onAdd={handleAdd} />
      <EditCardModal open={isEditOpen} setIsOpen={setIsEditOpen} card={selectedCard} onSave={handleEditSave} />
      <DeleteCardModal open={isDeleteOpen} setIsOpen={setIsDeleteOpen} onDelete={handleDeleteConfirm} cardNumber={selectedCard?.cardNumber} />
    </div>
  );
}