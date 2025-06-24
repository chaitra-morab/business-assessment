'use client';
import React, { createContext, useState, useContext } from 'react';
import AssessmentEntryModal from './AssessmentEntryModal';

const AssessmentModalContext = createContext({
  open: false,
  openModal: () => {},
  closeModal: () => {},
});

export function useAssessmentModal() {
  return useContext(AssessmentModalContext);
}

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return (
    <AssessmentModalContext.Provider value={{ open, openModal, closeModal }}>
      <AssessmentEntryModal open={open} onClose={closeModal} />
      {children}
    </AssessmentModalContext.Provider>
  );
};

export default ModalProvider; 