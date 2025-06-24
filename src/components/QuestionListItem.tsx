import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import useModals from './ModalContext';

interface Question {
    id: string;
    text: string;
    category: string;
    weight: number;
    status: 'active' | 'inactive';
}

interface QuestionListItemProps {
    question: Question;
    onEdit: (question: Question) => void;
    onDelete: (id: string) => Promise<void>;
    onToggleStatus: (id: string, newStatus: 'active' | 'inactive') => Promise<void>;
}

const QuestionListItem: React.FC<QuestionListItemProps> = ({ question, onEdit, onDelete, onToggleStatus }) => {
    const { showConfirmation } = useModals();

    const handleDeleteClick = async () => {
        const confirmed = await showConfirmation(`Are you sure you want to delete question "${question.text}"?`);
        if (confirmed) {
            await onDelete(question.id);
        }
    };

    const handleToggleClick = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStatus = e.target.checked ? 'active' : 'inactive';
        const confirmed = await showConfirmation(`Change status of question "${question.text}" to "${newStatus}"?`);
        if (confirmed) {
            await onToggleStatus(question.id, newStatus);
        } else {
            e.target.checked = !e.target.checked;
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-200 last:border-b-0 hover:bg-blue-50 transition-colors duration-150 rounded-lg my-2">
            <div className="flex-grow mb-3 sm:mb-0">
                <p className="text-lg font-medium text-gray-800">{question.text}</p>
                <span className="text-sm text-gray-600">
                    Category: <span className="font-semibold">{question.category}</span> | Weight: <span className="font-semibold">{question.weight}</span> | Status: <span className={`font-semibold ${question.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{question.status}</span>
                </span>
            </div>
            <div className="flex items-center space-x-3 flex-wrap sm:flex-nowrap">
                <button
                    onClick={() => onEdit(question)}
                    className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-md text-sm hover:bg-blue-200 transition-colors duration-200 flex items-center shadow-sm hover:shadow-md mb-2 sm:mb-0"
                >
                    <Edit size={16} className="mr-1" /> Edit
                </button>
                <button
                    onClick={handleDeleteClick}
                    className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm hover:bg-red-200 transition-colors duration-200 flex items-center shadow-sm hover:shadow-md mb-2 sm:mb-0"
                >
                    <Trash2 size={16} className="mr-1" /> Delete
                </button>
                <label className="relative inline-block w-11 h-6">
                    <input
                        type="checkbox"
                        checked={question.status === 'active'}
                        onChange={handleToggleClick}
                        className="opacity-0 w-0 h-0 peer"
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full before:absolute before:content-[''] before:h-5 before:w-5 before:left-[2px] before:bottom-[2px] before:bg-white before:rounded-full before:transition-transform peer-checked:bg-blue-600 peer-checked:before:translate-x-5 transition-colors duration-300 shadow-inner peer-checked:shadow-inner"></span>
                </label>
            </div>
        </div>
    );
};

export default QuestionListItem; 