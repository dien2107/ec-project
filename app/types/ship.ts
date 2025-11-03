export type EntityStatus = {
  statusId: number;
  name: string;
  displayName: string;
  entityType: string;
};

export type Ship = {
  shipId: number;
  corpName?: string;
  description?: string;
  baseCost?: number;
  estimatedDays?: number;
  statusId?: number;
  statusName?: string;
  status?: EntityStatus | null;
  createdAt: string;
  updatedAt: string;
  canDelete?: boolean;
};

// Note: no default export because this file only exports types.
