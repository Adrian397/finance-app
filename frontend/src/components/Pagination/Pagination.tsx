import React, { type ReactElement } from "react";
import "./Pagination.scss";
import arrowRightIcon from "@/assets/images/common/icon-caret-right.svg";
import arrowLeftIcon from "@/assets/images/common/icon-caret-left.svg";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps): ReactElement | null => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (
    endPage - startPage + 1 < maxPagesToShow &&
    totalPages >= maxPagesToShow
  ) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="pagination__nav text-preset-4"
        aria-label="Previous page"
      >
        <img src={arrowLeftIcon} alt="Previous" />
        Prev
      </button>
      <div className="pagination__pages">
        {startPage > 1 && (
          <>
            <button onClick={() => onPageChange(1)} className="text-preset-4">
              1
            </button>
            {startPage > 2 && <span className="pagination__ellipsis">...</span>}
          </>
        )}
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`text-preset-4 ${pageNumber === currentPage ? "active" : ""}`}
            aria-current={pageNumber === currentPage ? "page" : undefined}
          >
            {pageNumber}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="pagination__ellipsis">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="text-preset-4"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="pagination__nav text-preset-4"
        aria-label="Next page"
      >
        Next <img src={arrowRightIcon} alt="Next" />
      </button>
    </div>
  );
};
