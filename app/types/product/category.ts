import type { Status } from "../status";

export type Category = {
  categoryId: number;
  name: string;
  slug: string;
};

export interface CategoryDetailDto {
  categoryId: number;
  name: string;
  slug: string;
  description: string;
  sizeDetail: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: number | null;
  parentName: String;
  status: Status;
}
