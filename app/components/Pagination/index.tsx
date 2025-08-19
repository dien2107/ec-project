import {
  Pagination as PaginationUI,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "~/components/ui/pagination";
import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { PaginationProps } from "./types";

export default function Pagination({
  currentPage,
  totalPages,
  siblingCount = 2,
  onPageChange,
}: PaginationProps) {
  const remainingPages = totalPages - currentPage;

  return (
    <PaginationUI>
      <PaginationContent>
        {/* Show button "Chevron Left" as Previous Button */}
        {currentPage > 1 && (
          <PaginationItem>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft />
            </Button>
          </PaginationItem>
        )}

        {/* Show button "1" when current gte 3 */}
        {currentPage - siblingCount > 1 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
            </PaginationItem>
            {currentPage - siblingCount > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {/* Show sibling button left */}
        {Array.from(
          {
            length: Math.max(0, Math.min(currentPage - 1, siblingCount)),
          },
          (_, i) => {
            const page =
              currentPage - Math.min(currentPage - 1, siblingCount) + i;
            return (
              <PaginationItem key={page}>
                <PaginationLink onClick={() => onPageChange(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          }
        )}

        {/* Show current page */}
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {currentPage}
          </PaginationLink>
        </PaginationItem>

        {/* Show sibling button right */}
        {Array.from(
          {
            length: Math.max(0, Math.min(remainingPages, siblingCount)),
          },
          (_, i) => {
            const page = currentPage + i + 1;
            return (
              <PaginationItem key={page}>
                <PaginationLink onClick={() => onPageChange(page)}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          }
        )}

        {/* Show button "totalPages" when remainingPages > siblingCount */}
        {remainingPages > siblingCount && (
          <>
            {currentPage + siblingCount + 1 !== totalPages && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Show button "Chevron Right" as Next Button */}
        {currentPage < totalPages && (
          <PaginationItem>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => onPageChange(currentPage + 1)}
            >
              <ChevronRight />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </PaginationUI>
  );
}
