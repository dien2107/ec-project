// Types matching API response
export type Province = {
  id: number;
  code: string;
  name: string;
};

export type Ward = {
  id: number;
  provinceId: number;
  code: string;
  name: string;
};

export type Address = {
  addressId: number;
  userId: number;
  recipientName: string;
  phone: string;
  streetAddress: string;
  province: Province;
  ward: Ward;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};
