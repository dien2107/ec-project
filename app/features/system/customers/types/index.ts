// ===== Types =====
export type EntityStatus = {
  statusId: number;
  name: string;
  displayName: string;
  entityType: string;
};

export type Role = {
  roleId: number;
  name: string;
  description: string;
  status: EntityStatus;
  permissionIds: number[];
};

export type Address = {
  addressId?: number;
  recipientName?: string;
  phone?: string;
  streetAddress?: string;
  city?: string;
  ward?: string;
  district?: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Customer = {
  userId: number;
  username?: string;
  email?: string;
  imageUrl?: string | null;
  fullName?: string;
  phone?: string;
  gender?: "Male" | "Female" | null;
  dateOfBirth?: string | null;
  isVerified?: boolean;
  createdAt?: string;
  status?: EntityStatus | null;
  roles?: Role[];
  addresses?: Address[];
  orderCount?: number;
  totalSpent?: number;
  joinDate?: string;
  address?: string;
  orders?: { id: string; date: string; amount: number; status: string }[];
};

export type UpdateCustomerData = {
  username: string;
  email: string;
  imageUrl: string;
  fullName: string;
  phone: string;
  gender: "Male" | "Female";
  dateOfBirth: string | null;
  isVerified: boolean;
  statusId: number;
  roleIds: number[];
  // include addresses to avoid losing them
  addresses?: Address[];
};
export type createCustomerData = {
  username: string;
  email: string;
  imageUrl: string;
  fullName: string;
  phone: string;
  gender: "Male" | "Female";
  dateOfBirth: string | null;
  isVerified: boolean;
  statusId: number;
  roleIds: number[];
};
