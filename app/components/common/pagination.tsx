import { useCallback } from "react";
import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationProps } from "~/types/pagination.schema";
import { usePagination } from "~/hooks/use-pagination";

export default function Pagination({
  currentPage,
  totalPages,
  siblingCount = 2,
  onPageChange,
}: PaginationProps) {
  const { prevPages, nextPages, showFirstEllipsis, showLastEllipsis } =
    usePagination({
      currentPage,
      totalPages,
      siblingCount,
    });

  const handleChangePage = useCallback(
    (page: number) => {
      if (page > 0 && page <= totalPages && page !== currentPage) {
        onPageChange(page);
      }
    },
    [onPageChange, totalPages, currentPage]
  );

  const renderPageItem = (page: number) => (
    <PaginationItem key={page}>
      <PaginationLink onClick={() => handleChangePage(page)}>
        {page}
      </PaginationLink>
    </PaginationItem>
  );

  const showFirstPage = currentPage - siblingCount > 1;
  const showLastPage = totalPages - currentPage > siblingCount;

  return (
    <PaginationUI>
      <PaginationContent>
        {currentPage > 1 && (
          <PaginationItem>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => handleChangePage(currentPage - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft />
            </Button>
          </PaginationItem>
        )}

        {showFirstPage && (
          <>
            {renderPageItem(1)}
            {showFirstEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {prevPages.map(renderPageItem)}

        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>

        {nextPages.map(renderPageItem)}

        {showLastPage && (
          <>
            {showLastEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {renderPageItem(totalPages)}
          </>
        )}

        {currentPage < totalPages && (
          <PaginationItem>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => handleChangePage(currentPage + 1)}
              aria-label="Next page"
            >
              <ChevronRight />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationUI>
  );
}
