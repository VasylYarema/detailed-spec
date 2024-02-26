import React, {useState} from 'react';
import style from './Items.module.css'
import ImageWithPolygons from '../ImageWithPolygons/ImageWithPolygons';
import Modal from '../Modal/Modal';

const Items = ({items, polygons}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(54)
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / pageSize);

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

  const goToPage = (pageNumber) => {
      setCurrentPage(pageNumber);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };

  const selectItem = (key, polygons) => {
    setSelectedItem({
      key: key.replace("thumbnails", 'images'),
      polygons
    })
    openModal();
  }

  const generatePageNumbers = () => {
    const totalPages = Math.ceil(items.length / pageSize);
    const visiblePages = 3;

    let pageNumbers = [];
    if (totalPages <= visiblePages) {
        pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
        const leftBound = Math.min(Math.max(currentPage - 1, 1), totalPages - visiblePages + 1);
        const rightBound = Math.min(leftBound + visiblePages - 1, totalPages);

        if (leftBound > 1) {
            pageNumbers.push(1);
            if (leftBound > 1) {
                pageNumbers.push('...');
            }
        }

        for (let i = leftBound; i <= rightBound; i++) {
            pageNumbers.push(i);
        }

        if (rightBound < totalPages) {
            if (rightBound < totalPages - 1) {
                pageNumbers.push('...');
            }
            pageNumbers.push(totalPages);
        }
    }

    return pageNumbers;
  };

  const pageNumbers = generatePageNumbers();

  const url = 'https://s3.eu-central-1.amazonaws.com/dataspan.frontend-home-assignment/';
  return (
    <>
      <ul className={style.Items}>
        {currentItems.map((item, index) =>
            <li key={item.Key} className={style.Item} onClick={() => selectItem(item.Key, polygons[index])}>
                <ImageWithPolygons imageUrl={`${url}${item.Key}`} polygons={polygons[index]}/>
                <p className={style.ItemName}>{item.Key}</p>
            </li>
        )}
      </ul>

      <div className={style.Pagination}>
          <button className={style.PaginationButton} onClick={prevPage} disabled={currentPage === 1}>Previous</button>
          {pageNumbers.map((pageNumber, index) => (
              <button key={index} onClick={() => goToPage(pageNumber)} className={`${style.PaginationButton} ${currentPage === pageNumber ? style.PaginationButtonActive : ''}`}>{pageNumber}</button>
          ))}
          <button className={style.PaginationButton} onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
      {isModalOpen && <Modal openModal={openModal} closeModal={closeModal}>
        <h5>{selectedItem.key}</h5>
        <ImageWithPolygons width={500} height={500} imageUrl={`${url}${selectedItem.key}`} polygons={selectedItem.polygons}/>
      </Modal>}
    </>
  );
}

export default Items;