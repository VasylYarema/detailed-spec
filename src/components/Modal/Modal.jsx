import React from 'react';
import style from './Modal.module.css'

const Modal = ({children, closeModal, openModal}) => {

  return (
    <>
      <div className={style.Modal}>
          <div className={style.ModalContent}>
              <span className={style.ModalClose} onClick={closeModal}>x</span>
              {children}
          </div>
      </div>
    </>
  );
}

export default Modal;