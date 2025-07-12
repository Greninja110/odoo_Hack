import React from 'react';
import { Pagination as BootstrapPagination } from 'react-bootstrap';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range = [];
    
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page if it's not already in the range
    if (range[0] > 2) {
      range.unshift('...');
    }
    if (range[0] > 1) {
      range.unshift(1);
    }

    // Add last page if it's not already in the range
    if (range[range.length - 1] < totalPages - 1) {
      range.push('...');
    }
    if (range[range.length - 1] < totalPages) {
      range.push(totalPages);
    }

    return range;
  };

  if (totalPages <= 1) return null;

  return (
    <BootstrapPagination className="justify-content-center">
      <BootstrapPagination.Prev
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      />

      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return <BootstrapPagination.Ellipsis key={`ellipsis-${index}`} disabled />;
        }
        return (
          <BootstrapPagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </BootstrapPagination.Item>
        );
      })}

      <BootstrapPagination.Next
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      />
    </BootstrapPagination>
  );
};

export default Pagination;