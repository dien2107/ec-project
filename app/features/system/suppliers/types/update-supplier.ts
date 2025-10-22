export interface UpdateSupplierRequest {
  name: string;
  contact: string;
  info: string;
  status: "active" | "inactive";
}