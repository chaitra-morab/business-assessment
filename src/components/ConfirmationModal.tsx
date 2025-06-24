import React from 'react';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-[1001] p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative animate-fade-in-up">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors" onClick={onCancel}>
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">Confirm Action</h3>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        className="bg-gray-300 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
                        onClick={onConfirm}
                    >
                        Confirm
                    </button>
                    <button
                        className="bg-red-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal; 