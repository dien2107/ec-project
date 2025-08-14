export interface PaginationBaseProps {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}

export interface PaginationProps extends PaginationBaseProps {
  onPageChange: (page: number) => void;
}