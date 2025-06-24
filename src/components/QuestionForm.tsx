import React, { useState, useEffect } from 'react';
import useModals from './ModalContext';

interface Question {
    id: string;
    text: string;
    category: 'Business Health' | 'Franchise Readiness' | '';
    weight: number;
    status: 'active' | 'inactive';
}

interface QuestionFormProps {
    onSaveQuestion: (question: Question) => void;
    editingQuestion: Question | null;
    onCancelEdit: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ onSaveQuestion, editingQuestion, onCancelEdit }) => {
    const { showMessage } = useModals();
    const [question, setQuestion] = useState<Question>({
        id: '',
        text: '',
        category: '',
        weight: 1,
        status: 'active',
    });

    useEffect(() => {
        if (editingQuestion) {
            setQuestion(editingQuestion);
        } else {
            setQuestion({ id: '', text: '', category: '', weight: 1, status: 'active' });
        }
    }, [editingQuestion]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setQuestion((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.text.trim() || !question.category || isNaN(question.weight) || question.weight < 1 || question.weight > 10) {
            showMessage('Error', 'Please fill in all question fields correctly. Weight must be between 1 and 10.');
            return;
        }
        onSaveQuestion(question);
        setQuestion({ id: '', text: '', category: '', weight: 1, status: 'active' });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-xl mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{editingQuestion ? 'Edit Question' : 'Add New Question'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="hidden" value={question.id} />
                <div className="md:col-span-2">
                    <label htmlFor="text" className="block text-gray-700 text-sm font-medium mb-1">Question Text:</label>
                    <textarea
                        id="text"
                        rows={3}
                        value={question.text}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-base transition-all duration-200"
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="category" className="block text-gray-700 text-sm font-medium mb-1">Category:</label>
                    <select
                        id="category"
                        value={question.category}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-base transition-all duration-200"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Business Health">Business Health</option>
                        <option value="Franchise Readiness">Franchise Readiness</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="weight" className="block text-gray-700 text-sm font-medium mb-1">Weight (1-10):</label>
                    <input
                        type="number"
                        id="weight"
                        value={question.weight}
                        onChange={handleChange}
                        min={1}
                        max={10}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-base transition-all duration-200"
                        required
                    />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="status" className="block text-gray-700 text-sm font-medium mb-1">Status:</label>
                    <select
                        id="status"
                        value={question.status}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-base transition-all duration-200"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="flex space-x-3 md:col-span-2 justify-start">
                    <button
                        type="submit"
                        className={`px-6 py-3 rounded-lg font-semibold text-white ${editingQuestion ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
                    >
                        {editingQuestion ? 'Update Question' : 'Add Question'}
                    </button>
                    {editingQuestion && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default QuestionForm; 