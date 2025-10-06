// types/address.ts
export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  isDefault: boolean;
  createdDate: string;
}
export interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
  onSetDefault: (id: string) => void;
  canDelete: boolean;
}

export interface AddressFormData {
  name: string;
  phone: string;
  address: string;
  district: string;
  city: string;
}

export interface AddressFormProps {
  formData: AddressFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEdit?: boolean;
}
