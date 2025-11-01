import type { Status } from "~/types/status";

export type Material = {
  materialId: number;
  name: string;
};

export interface MaterialDetailDto {
  materialId: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: Status;
}
