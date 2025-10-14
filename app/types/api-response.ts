export interface ApiResponse<T> {
  status: number;
  isSuccess: boolean;
  message: string;
  data: T;
}

export interface ApiPagedResponse<T> {
  status: number;
  isSuccess: boolean;
  message: string;
  data: {
    items: T[];
    totalCount: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
  };
}
