import React from 'react';
import { X } from 'lucide-react';

interface MessageModalProps {
    title: string;
    content: string;
    onClose: () => void;
    isOpen: boolean;
}

const MessageModal: React.FC<MessageModalProps> = ({ title, content, onClose, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-[1001] p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative animate-fade-in-up">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors" onClick={onClose}>
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-blue-600 mb-4">{title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap mb-6">{content}</p>
                <div className="flex justify-end">
                    <button
                        className="bg-gray-300 text-gray-800 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-400 transition-all duration-200 shadow-md hover:shadow-lg"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageModal; 