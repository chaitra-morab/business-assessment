import { createContext, useContext } from 'react';

export interface ModalContextType {
    showConfirmation: (message: string) => Promise<boolean>;
    showMessage: (title: string, content: string) => void;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

const useModals = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModals must be used within a ModalProvider');
    }
    return context;
};

export default useModals; 