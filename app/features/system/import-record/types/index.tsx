// ------------------- Types -------------------
export interface ImportItem {
  id: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ImportRecord {
  id: string;
  supplier: string;
  quantity: number;
  totalAmount: number;
  importDate: string;
  createdBy: string;
  status: "completed" | "pending" | "cancelled";
  items: ImportItem[];
  notes?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface ImportDetailModalProps {
  importRecord: ImportRecord | null;
  isOpen: boolean;
  onClose: () => void;
}
