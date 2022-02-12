import { useState, useEffect, useRef } from "react";

import { AiOutlineCloseSquare } from "react-icons/ai";

export const Modal = (props) => {
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        const loadingView = document.querySelector(".loading-opacity");
        const checkIsLoading = loadingView.classList.contains("is-show");
        if (ref.current && !ref.current.contains(event.target) && !checkIsLoading) {
          //   setAccount("");
          //   setPassword("");
          //   handleCloseModal();
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = useRef(null);
  // useOutsideAlerter(wrapperRef);
  return (
    <>
      <div className="modal-opacity">
        <div className="box-modal" ref={wrapperRef} style={props.maxHeight && { maxHeight: props.maxHeight }}>
          {props.children}
        </div>
      </div>
    </>
  );
};

export const ModalHeader = (props) => {
  return (
    <>
      <div className="modal__header">
        <div className="modal__header--title">{props.title}</div>
        <div className="modal__header--icon" onClick={() => props.handleCloseModal()}>
          <AiOutlineCloseSquare />
        </div>
      </div>
    </>
  );
};
export const ModalBody = (props) => {
  return (
    <>
      <div className="modal__body">{props.children}</div>
    </>
  );
};
