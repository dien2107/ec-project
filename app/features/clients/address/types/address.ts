export interface AddressFormData {
  recipientName: string;
  phone: string;
  streetAddress: string;
  provinceId: number | null;
  wardId: number | null;
  isDefault: boolean;
}
