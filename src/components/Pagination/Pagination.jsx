import React, { useEffect, useState } from 'react';

const Pagination = ({items, setItems}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Наприклад, 10 елементів на сторінці

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / pageSize);

  console.log('totalPages', totalPages);

  useEffect(() => {
    setItems(items.slice(startIndex, endIndex))
  }, [])

  const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
  };

  const nextPage = () => {
      if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
      }
  };

  const prevPage = () => {
      if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
      }
  };

  return (
      <div>
          <button onClick={prevPage} disabled={currentPage === 1}>Попередня сторінка</button>
          <button onClick={nextPage} disabled={currentPage === totalPages}>Наступна сторінка</button>
      </div>
  );
}

export default Pagination;